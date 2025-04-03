import { AutoMap } from '@automapper/classes';
import { AuthorDto } from './author.dto';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleDto {
    @AutoMap()
    id: string;

    @AutoMap()
    name: string;

    @AutoMap()
    description: string;

    @AutoMap()
    createdDate: string;

    @AutoMap()
    updatedDate: string;

    @AutoMap()
    author: AuthorDto;
}

export class ArticleDeletedDto {
    id: string;
}

export class ArticleCreateDto {
    @ApiProperty({
        type: String,
        description: 'Article name',
        example: 'How to Learn NestJS',
    })
    @AutoMap()
    @IsNotEmpty({ message: 'Article name is required' })
    @MinLength(3, { message: 'Article name must be at least 3 characters long' })
    @MaxLength(100, { message: 'Article name must not exceed 100 characters' })
    name: string;

    @ApiProperty({
        type: String,
        description: 'Article description',
        example: 'This article explains the basics of NestJS framework and how to get started.',
    })
    @AutoMap()
    @IsNotEmpty({ message: 'Article description is required' })
    @MinLength(10, { message: 'Article description must be at least 10 characters long' })
    @MaxLength(500, { message: 'Article description must not exceed 500 characters' })
    description: string;
}

export class ArticleUpdateDto extends ArticleCreateDto {}
