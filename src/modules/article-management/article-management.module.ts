import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleManagementController } from './article-management.controller';
import { ArticleManagementService } from './article-management.service';
import { ArticleEntity, UserEntity } from '../../database';
import { ConfigModule } from '@nestjs/config';
import { ArticleManagementMapperProfile } from './mappers/article-management.mapper-profile';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity, ArticleEntity])],
    controllers: [ArticleManagementController],
    providers: [ArticleManagementMapperProfile, ArticleManagementService],
})
export class ArticleManagementModule {}
