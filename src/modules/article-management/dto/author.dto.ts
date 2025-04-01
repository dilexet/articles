import { AutoMap } from '@automapper/classes';

export class AuthorDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}
