import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
