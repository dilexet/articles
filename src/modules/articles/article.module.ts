import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleEntity, UserEntity } from '../../database';
import { ConfigModule } from '@nestjs/config';
import { ArticleMapperProfile } from './mappers/article.mapper-profile';
import { CacheRedisService } from '../cache-redis/cache-redis.service';
import { CacheRedisModule } from '../cache-redis/cache-redis.module';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity, ArticleEntity]), CacheRedisModule],
    controllers: [ArticleController],
    providers: [ArticleMapperProfile, CacheRedisService, ArticleService],
})
export class ArticleModule {}
