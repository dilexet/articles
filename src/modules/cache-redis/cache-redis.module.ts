import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const redisStore = createKeyv(configService.get<string>('REDIS_URL'));

                return {
                    stores: [redisStore],
                    isGlobal: true,
                    ttl: +configService.get<number>('REDIS_TTL', 216000),
                };
            },
        }),
    ],
    exports: [CacheModule],
})
export class CacheRedisModule {}
