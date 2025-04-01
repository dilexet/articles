import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizeService } from './authorize.service';
import { CookieTokenService } from './utils/cookie-service';

@ApiTags('Authorize')
@Controller('authorize')
export class AuthorizeController {
  constructor(
    private authorizeService: AuthorizeService,
    private cookieTokenService: CookieTokenService,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    try {
      const result = await this.authorizeService.loginAsync(loginDto);

      if (result === null) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });
      }

      this.cookieTokenService.setTokenToCookie(res, result);

      return res.status(HttpStatus.OK).json({ message: 'Login successful' });
    } catch (error) {
      console.log(error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Login successful' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('register')
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    try {
      const result = await this.authorizeService.registrationAsync(registerDto);

      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid credentials' });
      }

      this.cookieTokenService.setTokenToCookie(res, result);

      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'User registered successfully' });
    } catch (error) {
      console.log(error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }

  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or missing refresh token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken: string | null =
        this.cookieTokenService.getRefreshTokenFromCookie(req);

      if (!refreshToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Refresh token missing' });
      }

      const result =
        await this.authorizeService.refreshTokenAsync(refreshToken);

      if (!result) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid refresh token' });
      }

      this.cookieTokenService.setTokenToCookie(res, result);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
      console.log(error);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' });
    }
  }
}
