import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @AutoMap()
  id: string;
}
