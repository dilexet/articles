import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../database';
import { Repository } from 'typeorm';
import { ITokenPayloadType } from '../types/token.type';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CookieTokenService } from '../utils/cookie-service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @Inject(ConfigService)
        private readonly config: ConfigService,
        private readonly cookieTokenService: CookieTokenService,
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_ACCESS_SECRET') as string,
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return this.cookieTokenService.getAccessTokenFromCookie(req) || null;
                },
            ]),
        });
    }

    async validate(payload: ITokenPayloadType) {
        const { userId } = payload;

        if (!userId) {
            throw new UnauthorizedException();
        }

        const user = await this.userRepository.findOneBy({
            id: userId,
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return {
            id: user.id,
        };
    }
}
