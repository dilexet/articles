import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Request, Response } from 'express';
import { ITokenType } from '../types/token.type';

@Injectable()
export class CookieTokenService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  setTokenToCookie(res: Response, tokens: ITokenType): Response {
    const jwtAccessCookieName: string = this.config.get<string>(
      'JWT_ACCESS_COOKIE_NAME',
    ) as string;

    const jwtRefreshCookieName: string = this.config.get<string>(
      'JWT_REFRESH_COOKIE_NAME',
    ) as string;

    const defaultParams: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    };

    res.cookie(jwtAccessCookieName, tokens.accessToken, {
      ...defaultParams,
      maxAge: tokens.accessTokenExpiresInMilliseconds,
    });

    res.cookie(jwtRefreshCookieName, tokens.refreshToken, {
      ...defaultParams,
      maxAge: tokens.refreshTokenExpiresInMilliseconds,
    });

    return res;
  }

  getRefreshTokenFromCookie(req: Request): string | null {
    const jwtRefreshCookieName: string = this.config.get<string>(
      'JWT_REFRESH_COOKIE_NAME',
    ) as string;

    return req.cookies[jwtRefreshCookieName] as string;
  }

  getAccessTokenFromCookie(req: Request): string | null {
    const jwtAccessCookieName: string = this.config.get<string>(
      'JWT_ACCESS_COOKIE_NAME',
    ) as string;

    return req.cookies[jwtAccessCookieName] as string;
  }
}
