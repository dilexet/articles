import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizeController } from './authorize.controller';
import { AuthorizeService } from './authorize.service';
import { UserEntity } from '../../database';
import { TokenService } from './utils/token-service';
import { AuthorizeMapperProfile } from './mappers/authorize.mapper-profile';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieTokenService } from './utils/cookie-service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthorizeController],
  providers: [
    AuthorizeMapperProfile,
    JwtService,
    AuthorizeService,
    TokenService,
    CookieTokenService,
    JwtStrategy,
  ],
})
export class AuthorizeModule {}
