import { Injectable, NotFoundException } from '@nestjs/common';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ArticleEntity } from '../../database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleDto } from './dto/article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleEntityRepository: Repository<ArticleEntity>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async getArticlesByFilterAsync(): Promise<ArticleDto[]> {
    const articles = await this.articleEntityRepository.find({
      relations: {
        author: true,
      },
    });

    if (!articles?.length) {
      return [];
    }

    return this.mapper.mapArray(articles, ArticleEntity, ArticleDto);
  }

  async getArticleByIdAsync(id: string): Promise<ArticleDto> {
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

    return this.mapper.map(existArticle, ArticleEntity, ArticleDto);
  }
}
