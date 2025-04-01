import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @ApiOperation({
        summary: 'Get articles by filter',
    })
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
        status: HttpStatus.NOT_FOUND,
        description: 'Articles wan not found',
    })
    @Get()
    async getArticlesByFilter(@Res() res: Response) {
        try {
            const result = await this.articleService.getArticlesByFilterAsync();

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
