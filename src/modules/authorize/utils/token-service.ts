import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../../database';
import { ConfigService } from '@nestjs/config';
import { ITokenPayloadType, ITokenType } from '../types/token.type';
import * as ms from 'ms';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        @Inject(ConfigService)
        private readonly config: ConfigService,
    ) {}

    async generateTokensAsync(user: UserEntity): Promise<ITokenType | null> {
        const payload: ITokenPayloadType = {
            userId: user.id,
        };

        const config = {
            accessTokenSecret: this.config.get<string>('JWT_ACCESS_SECRET'),
            accessTokenExpiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') as ms.StringValue,
            refreshTokenSecret: this.config.get<string>('JWT_REFRESH_SECRET'),
            refreshTokenExpiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') as ms.StringValue,
        };

        if (
            !config?.accessTokenExpiresIn ||
            !config?.refreshTokenExpiresIn ||
            !config.refreshTokenSecret ||
            !config.accessTokenSecret
        ) {
            return null;
        }

        try {
            const accessToken = await this.jwtService.signAsync(payload, {
                secret: config.accessTokenSecret,
                expiresIn: config.accessTokenExpiresIn,
            });

            const refreshToken = await this.jwtService.signAsync(payload, {
                secret: config.refreshTokenSecret,
                expiresIn: config.refreshTokenExpiresIn,
            });

            const accessTokenExpiresInMilliseconds = ms(config.accessTokenExpiresIn);
            const refreshTokenExpiresInMilliseconds = ms(config.refreshTokenExpiresIn);

            return {
                accessToken,
                refreshToken,
                accessTokenExpiresInMilliseconds,
                refreshTokenExpiresInMilliseconds,
            };
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async validateRefreshTokenAsync(token: string): Promise<ITokenPayloadType | null> {
        const config = {
            accessTokenSecret: this.config.get<string>('JWT_ACCESS_SECRET'),
            accessTokenExpiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN'),
            refreshTokenSecret: this.config.get<string>('JWT_REFRESH_SECRET'),
            refreshTokenExpiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN'),
        };

        try {
            const refreshTokenData = await this.jwtService.verifyAsync<ITokenPayloadType>(token, {
                secret: config.refreshTokenSecret,
            });

            if (!refreshTokenData) {
                return null;
            }

            return refreshTokenData;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
