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
import { IArticleFilterParams, IArticleSortParams, IPaginationParams } from './types/filters.type';
import { PaginatedResult } from '../../types/pagination.type';

@Injectable()
export class ArticleManagementService {
    constructor(
        @InjectRepository(ArticleEntity)
        private articleEntityRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private userEntityRepository: Repository<UserEntity>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async getArticlesByFilterAsync(
        userId: string,
        queryParams: IArticleFilterParams & IArticleSortParams & IPaginationParams,
    ): Promise<PaginatedResult<ArticleDto>> {
        const filter: IArticleFilterParams = {
            name: queryParams.name,
            description: queryParams.description,
            createdDateFrom: queryParams.createdDateFrom,
            createdDateTo: queryParams.createdDateTo,
            updatedDateFrom: queryParams.updatedDateFrom,
            updatedDateTo: queryParams.updatedDateTo,
        };

        const sort: IArticleSortParams = {
            orderByName: queryParams.orderByName,
            orderByCreatedDate: queryParams.orderByCreatedDate,
            orderByUpdatedDate: queryParams.orderByUpdatedDate,
        };

        const pagination: IPaginationParams = {
            page: Number(queryParams.page) || 1,
            limit: Number(queryParams.limit) || 10,
        };

        const query = this.articleEntityRepository
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.author', 'author')
            .where('author.id = :userId', { userId });

        if (filter.name) {
            query.andWhere('article.name ILIKE :name', { name: `%${filter.name}%` });
        }

        if (filter.description) {
            query.andWhere('article.description ILIKE :description', { description: `%${filter.description}%` });
        }

        if (filter.createdDateFrom) {
            query.andWhere('article.createdDate >= :createdDateFrom', { createdDateFrom: filter.createdDateFrom });
        }

        if (filter.createdDateTo) {
            query.andWhere('article.createdDate <= :createdDateTo', { createdDateTo: filter.createdDateTo });
        }

        if (filter.updatedDateFrom) {
            query.andWhere('article.updatedDate >= :updatedDateFrom', { updatedDateFrom: filter.updatedDateFrom });
        }

        if (filter.updatedDateTo) {
            query.andWhere('article.updatedDate <= :updatedDateTo', { updatedDateTo: filter.updatedDateTo });
        }

        if (sort.orderByName) {
            query.orderBy('article.name', sort.orderByName);
        }
        if (sort.orderByCreatedDate) {
            query.orderBy('article.createdDate', sort.orderByCreatedDate);
        }
        if (sort.orderByUpdatedDate) {
            query.orderBy('article.updatedDate', sort.orderByUpdatedDate);
        }

        const [articles, total] = await query
            .take(pagination.limit || 10)
            .skip(((pagination.page || 1) - 1) * (pagination.limit || 10))
            .getManyAndCount();

        return {
            data: this.mapper.mapArray(articles, ArticleEntity, ArticleDto),
            total,
            page: pagination.page,
            limit: pagination.limit,
        };
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
