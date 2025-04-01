import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ nullable: false })
  @AutoMap()
  name: string;

  @Column({ nullable: false })
  @AutoMap()
  email: string;

  @Column({ nullable: false })
  passwordHash: string;
}
