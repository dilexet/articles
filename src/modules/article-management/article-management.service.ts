import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ArticleEntity, UserEntity } from '../../database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleCreateDto, ArticleDeletedDto, ArticleDto, ArticleUpdateDto } from './dto/article.dto';

@Injectable()
export class ArticleManagementService {
    constructor(
        @InjectRepository(ArticleEntity)
        private articleEntityRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private userEntityRepository: Repository<UserEntity>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async getArticlesByFilterAsync(userId: string): Promise<ArticleDto[]> {
        const articles = await this.articleEntityRepository.find({
            where: {
                author: {
                    id: userId,
                },
            },
            relations: {
                author: true,
            },
        });

        console.log('getArticlesByFilterAsync /articles', articles);

        if (!articles?.length) {
            return [];
        }

        return this.mapper.mapArray(articles, ArticleEntity, ArticleDto);
    }

    async getArticleByIdAsync(id: string, userId: string): Promise<ArticleDto> {
        const existArticle = await this.articleEntityRepository.findOne({
            where: {
                id,
            },
            relations: {
                author: true,
            },
        });

        console.log('getArticleByIdAsync /existArticle', existArticle);

        if (!existArticle) {
            throw new NotFoundException();
        }

        if (existArticle.author.id !== userId) {
            throw new ForbiddenException();
        }

        return this.mapper.map(existArticle, ArticleEntity, ArticleDto);
    }

    async createArticleAsync(userId: string, articleCreateDto: ArticleCreateDto): Promise<ArticleDto> {
        const user = await this.userEntityRepository.findOneBy({
            id: userId,
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        try {
            const articleMapped = this.mapper.map(articleCreateDto, ArticleCreateDto, ArticleEntity);

            articleMapped.author = user;

            const articleCreated = await this.articleEntityRepository.save(articleMapped);

            return this.mapper.map(articleCreated, ArticleEntity, ArticleDto);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async updateArticleAsync(id: string, userId: string, articleUpdateDto: ArticleUpdateDto): Promise<ArticleDto> {
        const existArticle = await this.articleEntityRepository.findOne({
            where: {
                id,
            },
            relations: {
                author: true,
            },
        });

        console.log('updateArticleAsync /existArticle', existArticle);

        if (!existArticle) {
            throw new NotFoundException();
        }

        if (existArticle.author.id !== userId) {
            throw new ForbiddenException();
        }

        try {
            const articleUpdated = await this.articleEntityRepository.save({
                ...existArticle,
                ...articleUpdateDto,
            });

            console.log('updateArticleAsync /articleUpdated', articleUpdated);

            return this.mapper.map(articleUpdated, ArticleEntity, ArticleDto);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async deleteArticleAsync(id: string, userId: string): Promise<ArticleDeletedDto> {
        const existArticle = await this.articleEntityRepository.findOne({
            where: {
                id,
            },
            relations: {
                author: true,
            },
        });

        console.log('deleteArticleAsync /existArticle', existArticle);

        if (!existArticle) {
            throw new NotFoundException();
        }

        if (existArticle.author.id !== userId) {
            throw new ForbiddenException();
        }

        try {
            await this.articleEntityRepository.delete(id);

            return {
                id: existArticle.id,
            };
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}
