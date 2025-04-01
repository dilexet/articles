import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../../database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenService } from './utils/token-service';
import { ITokenType } from './types/token.type';

@Injectable()
export class AuthorizeService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private tokenService: TokenService,
  ) {}

  async loginAsync(userDto: LoginDto): Promise<ITokenType | null> {
    const user = await this.userRepository.findOneBy({
      email: userDto?.email,
    });

    if (!user) {
      throw new BadRequestException('Login or password is incorrect');
    }

    const isPasswordsEquals = await bcrypt.compare(
      userDto.password,
      user.passwordHash,
    );

    if (!isPasswordsEquals) {
      throw new BadRequestException('Login or password is incorrect');
    }

    try {
      return await this.tokenService.generateTokensAsync(user);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async registrationAsync(userDto: RegisterDto): Promise<ITokenType | null> {
    const candidate = await this.userRepository.findOneBy({
      email: userDto?.email,
    });

    if (candidate) {
      throw new BadRequestException('User with this email already exist');
    }

    const newUser = this.mapper.map(userDto, RegisterDto, UserEntity);

    newUser.passwordHash = await bcrypt.hash(userDto.password, 5);

    try {
      const user = await this.userRepository.save(newUser);

      return await this.tokenService.generateTokensAsync(user);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async refreshTokenAsync(refreshToken: string): Promise<ITokenType | null> {
    const tokenPayload =
      await this.tokenService.validateRefreshTokenAsync(refreshToken);

    if (!tokenPayload?.userId) {
      throw new UnauthorizedException();
    }

    const candidate = await this.userRepository.findOneBy({
      id: tokenPayload.userId,
    });

    if (!candidate) {
      throw new UnauthorizedException();
    }

    try {
      return await this.tokenService.generateTokensAsync(candidate);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
