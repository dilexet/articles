import { Injectable, NotFoundException } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ArticleEntity } from '../../database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDto } from './dto/article.dto';
import { IArticleFilterParams, IArticleSortParams, IPaginationParams } from './types/filters.type';
import { PaginatedResult } from '../../types/pagination.type';
import { CacheRedisService } from '../cache-redis/cache-redis.service';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private articleEntityRepository: Repository<ArticleEntity>,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly cacheService: CacheRedisService,
    ) {}

    async getArticlesByFilterAsync(
        queryParams: IArticleFilterParams & IArticleSortParams & IPaginationParams,
    ): Promise<PaginatedResult<ArticleDto>> {
        const filter: IArticleFilterParams = {
            name: queryParams.name,
            description: queryParams.description,
            createdDateFrom: queryParams.createdDateFrom,
            createdDateTo: queryParams.createdDateTo,
            updatedDateFrom: queryParams.updatedDateFrom,
            updatedDateTo: queryParams.updatedDateTo,
            author: queryParams.author,
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
            .leftJoinAndSelect('article.author', 'author');

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

        if (filter.author) {
            query.andWhere('author.name ILIKE :authorName', { authorName: `%${filter.author}%` });
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

    async getArticleByIdAsync(id: string): Promise<ArticleDto> {
        const articleCacheKey = `article_${id}`;

        const cachedArticle = await this.cacheService.getCache<ArticleDto>(articleCacheKey);

        if (cachedArticle) {
            return cachedArticle;
        }

        const existArticle = await this.articleEntityRepository.findOne({
            where: {
                id,
            },
            relations: {
                author: true,
            },
        });

        if (!existArticle) {
            throw new NotFoundException();
        }

        const mappedArticle = this.mapper.map(existArticle, ArticleEntity, ArticleDto);

        await this.cacheService.setCache(articleCacheKey, mappedArticle);

        return mappedArticle;
    }
}
