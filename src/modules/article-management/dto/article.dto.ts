import { AutoMap } from '@automapper/classes';
import { AuthorDto } from './author.dto';
import { IsNotEmpty } from 'class-validator';
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
  })
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Article description',
  })
  @AutoMap()
  @IsNotEmpty()
  description: string;
}

export class ArticleUpdateDto extends ArticleCreateDto {}
