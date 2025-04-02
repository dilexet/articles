import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleManagementController } from './article-management.controller';
import { ArticleManagementService } from './article-management.service';
import { ArticleEntity, UserEntity } from '../../database';
import { ConfigModule } from '@nestjs/config';
import { ArticleManagementMapperProfile } from './mappers/article-management.mapper-profile';
import { CacheRedisModule } from '../cache-redis/cache-redis.module';
import { CacheRedisService } from '../cache-redis/cache-redis.service';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity, ArticleEntity]), CacheRedisModule],
    controllers: [ArticleManagementController],
    providers: [ArticleManagementMapperProfile, ArticleManagementService, CacheRedisService],
})
export class ArticleManagementModule {}
