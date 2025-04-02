import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticleManagementService } from './article-management.service';
import { ArticleCreateDto, ArticleDeletedDto, ArticleDto, ArticleUpdateDto } from './dto/article.dto';
import { JwtAuthGuard } from '../authorize/guards/jwt-auth.guard';
import { IArticleFilterParams, IArticleSortParams, IPaginationParams } from './types/filters.type';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('ArticlesManagement')
@Controller('articles-management')
export class ArticleManagementController {
    constructor(private articleManagementService: ArticleManagementService) {}

    @ApiOperation({ summary: 'Get articles by filter' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ArticleDto,
        isArray: true,
        description: 'Articles got successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Do not have access to this article',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by article name' })
    @ApiQuery({ name: 'description', required: false, type: String, description: 'Filter by article description' })
    @ApiQuery({
        name: 'createdDateFrom',
        required: false,
        type: String,
        description: 'Filter articles created after this date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'createdDateTo',
        required: false,
        type: String,
        description: 'Filter articles created before this date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'updatedDateFrom',
        required: false,
        type: String,
        description: 'Filter articles updated after this date (YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'updatedDateTo',
        required: false,
        type: String,
        description: 'Filter articles updated before this date (YYYY-MM-DD)',
    })
    @ApiQuery({ name: 'orderByName', required: false, enum: ['ASC', 'DESC'], description: 'Sort articles by name' })
    @ApiQuery({
        name: 'orderByCreatedDate',
        required: false,
        enum: ['ASC', 'DESC'],
        description: 'Sort articles by createdDate',
    })
    @ApiQuery({
        name: 'orderByUpdatedDate',
        required: false,
        enum: ['ASC', 'DESC'],
        description: 'Sort articles by updatedDate',
    })
    @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: true, type: Number, description: 'Number of articles per page' })
    @Get()
    async getArticlesByFilter(
        @Query() queryParams: IArticleFilterParams & IArticleSortParams & IPaginationParams,
        @Request() req,
        @Res() res: Response,
    ) {
        const userId: string = req.user.id as string;

        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }

        try {
            const result = await this.articleManagementService.getArticlesByFilterAsync(userId, queryParams);

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.log(error);

            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid request data' });
        }
    }

    @ApiOperation({ summary: 'Get article by id' })
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
        status: HttpStatus.FORBIDDEN,
        description: 'Do not have access to this article',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Article wan not found',
    })
    @Get(':id')
    async getArticleById(@Request() req, @Res() res: Response, @Param('id') id: string) {
        const userId: string = req.user.id as string;

        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }

        try {
            const result = await this.articleManagementService.getArticleByIdAsync(id, userId);

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.log(error);

            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid request data' });
        }
    }

    @ApiOperation({ summary: 'Create article' })
    @ApiBody({ type: ArticleCreateDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: ArticleDto,
        description: 'Article created successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    @Post()
    async createArticle(@Request() req, @Res() res: Response, @Body() articleDto: ArticleCreateDto) {
        const userId: string = req.user.id as string;

        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }

        try {
            const result = await this.articleManagementService.createArticleAsync(userId, articleDto);

            return res.status(HttpStatus.CREATED).json(result);
        } catch (error) {
            console.log(error);

            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid request data' });
        }
    }

    @ApiOperation({ summary: 'Update article' })
    @ApiBody({ type: ArticleUpdateDto })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ArticleDto,
        description: 'Article updated successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Do not have access to this article',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Article wan not found',
    })
    @Put(':id')
    async updateArticle(
        @Request() req,
        @Res() res: Response,
        @Param('id') id: string,
        @Body() articleDto: ArticleUpdateDto,
    ) {
        const userId: string = req.user.id as string;

        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }

        try {
            const result = await this.articleManagementService.updateArticleAsync(id, userId, articleDto);

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.log(error);

            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid request data' });
        }
    }

    @ApiOperation({ summary: 'Delete article' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ArticleDeletedDto,
        description: 'Article deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request data',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Do not have access to this article',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Article wan not found',
    })
    @Delete(':id')
    async deleteArticle(@Request() req, @Res() res: Response, @Param('id') id: string) {
        const userId: string = req.user.id as string;

        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }

        try {
            const result = await this.articleManagementService.deleteArticleAsync(id, userId);

            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.log(error);

            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid request data' });
        }
    }
}
