import { AutoMap } from '@automapper/classes';
import { AuthorDto } from './author.dto';

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