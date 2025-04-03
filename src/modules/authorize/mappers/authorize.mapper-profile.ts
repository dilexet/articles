import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { UserEntity } from '../../../database';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthorizeMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(mapper, RegisterDto, UserEntity);
        };
    }
}
