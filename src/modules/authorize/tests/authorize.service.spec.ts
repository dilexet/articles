import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizeService } from '../authorize.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../database';
import { TokenService } from '../utils/token-service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ITokenType } from '../types/token.type';
import { Mapper } from '@automapper/core';

describe('AuthService', () => {
    let authorizeService: AuthorizeService;
    let userRepository: Repository<UserEntity>;
    let tokenService: TokenService;
    let mapper: Mapper;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthorizeService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        findOneBy: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: 'automapper:nestjs:default',
                    useValue: {
                        map: jest.fn(),
                    },
                },
                {
                    provide: TokenService,
                    useValue: {
                        generateTokensAsync: jest.fn(),
                    },
                },
            ],
        }).compile();

        authorizeService = module.get<AuthorizeService>(AuthorizeService);
        userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
        tokenService = module.get<TokenService>(TokenService);
        mapper = module.get<Mapper>('automapper:nestjs:default');
    });

    describe('loginAsync', () => {
        it('should throw error if user does not exist', async () => {
            const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

            await expect(authorizeService.loginAsync(loginDto)).rejects.toThrow(
                new BadRequestException('Login or password is incorrect'),
            );
        });

        it('should throw error if passwords do not match', async () => {
            const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({
                email: 'test@example.com',
                passwordHash: 'hashedpassword',
            } as UserEntity);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

            const result = authorizeService.loginAsync(loginDto);

            await expect(result).rejects.toThrow(new BadRequestException('Login or password is incorrect'));
        });

        it('should return tokens if login is successful', async () => {
            const mockUser: UserEntity = { email: 'test@example.com', passwordHash: 'hashedpassword' } as UserEntity;

            const mockTokenData: ITokenType = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                accessTokenExpiresInMilliseconds: 3600,
                refreshTokenExpiresInMilliseconds: 3600,
            };

            const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
            jest.spyOn(tokenService, 'generateTokensAsync').mockResolvedValue(mockTokenData);

            const result = await authorizeService.loginAsync(loginDto);

            expect(result).toEqual(mockTokenData);
        });
    });

    describe('registrationAsync', () => {
        it('should throw error if user already exists', async () => {
            const registerDto: RegisterDto = { name: 'John Doe', email: 'test@example.com', password: 'password123' };

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({ email: 'test@example.com' } as UserEntity);

            const result = authorizeService.registrationAsync(registerDto);

            await expect(result).rejects.toThrow(new BadRequestException('User with this email already exist'));
        });

        it('should save new user and return tokens', async () => {
            const registerDto: RegisterDto = { name: 'John Doe', email: 'test@example.com', password: 'password123' };

            const mockUser: UserEntity = {
                id: '1',
                name: registerDto.name,
                email: registerDto.email,
                passwordHash: 'hashedpassword',
                articles: []
            } ;

            const mockTokenData: ITokenType = {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                accessTokenExpiresInMilliseconds: 3600,
                refreshTokenExpiresInMilliseconds: 3600,
            };

            jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

            jest.spyOn(mapper, 'map').mockReturnValue(mockUser as any);

            jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);
            jest.spyOn(tokenService, 'generateTokensAsync').mockResolvedValue(mockTokenData);

            const result = await authorizeService.registrationAsync(registerDto);
            expect(result).toEqual(mockTokenData);

            expect(mapper.map).toHaveBeenCalledWith(registerDto, RegisterDto, UserEntity);
            expect(userRepository.save).toHaveBeenCalledWith(mockUser);
            expect(tokenService.generateTokensAsync).toHaveBeenCalledWith(mockUser);
        });
    });
});
