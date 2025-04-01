import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { ArticleDto } from '../dto/article.dto';
import { ArticleEntity, UserEntity } from '../../../database';
import { AuthorDto } from '../dto/author.dto';

@Injectable()
export class ArticleMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserEntity, AuthorDto);

      createMap(
        mapper,
        ArticleEntity,
        ArticleDto,
        forMember(
          (dest) => dest.author,
          mapFrom((src) => mapper.map(src.author, UserEntity, AuthorDto)),
        ),
        forMember(
          (dest) => dest.createdDate,
          mapFrom((src) => src.createdDate.toISOString()),
        ),
        forMember(
          (dest) => dest.updatedDate,
          mapFrom((src) => src.updatedDate.toISOString()),
        ),
      );
    };
  }
}
