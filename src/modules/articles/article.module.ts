import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleEntity, UserEntity } from '../../database';
import { ConfigModule } from '@nestjs/config';
import { ArticleMapperProfile } from './mappers/article.mapper-profile';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity, ArticleEntity])],
    controllers: [ArticleController],
    providers: [ArticleMapperProfile, ArticleService],
})
export class ArticleModule {}
