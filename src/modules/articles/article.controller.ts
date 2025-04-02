import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { IArticleFilterParams, IArticleSortParams, IPaginationParams } from './types/filters.type';
import { PaginatedResult } from '../../types/pagination.type';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @ApiOperation({
        summary: 'Get articles by filter',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: PaginatedResult<ArticleDto>,
        description: 'Articles got successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Articles wan not found',
    })
    @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by article name' })
    @ApiQuery({ name: 'description', required: false, type: String, description: 'Filter by article description' })
    @ApiQuery({ name: 'createdDateFrom', required: false, type: String, description: 'Filter articles created after this date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'createdDateTo', required: false, type: String, description: 'Filter articles created before this date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'updatedDateFrom', required: false, type: String, description: 'Filter articles updated after this date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'updatedDateTo', required: false, type: String, description: 'Filter articles updated before this date (YYYY-MM-DD)' })
    @ApiQuery({ name: 'author', required: false, type: String, description: 'Filter articles by author name' })
    @ApiQuery({ name: 'orderByName', required: false, enum: ['ASC', 'DESC'], description: 'Sort articles by name' })
    @ApiQuery({ name: 'orderByCreatedDate', required: false, enum: ['ASC', 'DESC'], description: 'Sort articles by createdDate' })
    @ApiQuery({ name: 'orderByUpdatedDate', required: false, enum: ['ASC', 'DESC'], description: 'Sort articles by updatedDate' })
    @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: true, type: Number, description: 'Number of articles per page' })
    @Get()
    async getArticlesByFilter(
        @Query() queryParams: IArticleFilterParams & IArticleSortParams & IPaginationParams,
        @Res() res: Response,
    ) {
        try {
            const result = await this.articleService.getArticlesByFilterAsync(queryParams);

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.log(error);

            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Invalid request data',
            });
        }
    }

    @ApiOperation({
        summary: 'Get article by id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ArticleDto,
        description: 'Article got successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Article wan not found',
    })
    @Get(':id')
    async getArticleById(@Res() res: Response, @Param('id') id: string) {
        try {
            const result = await this.articleService.getArticleByIdAsync(id);

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.log(error);

            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Invalid request data',
            });
        }
    }
}
