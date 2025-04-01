import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';
import { UserEntity } from './user.entity';

@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity {
    @Column({ nullable: false })
    @AutoMap()
    name: string;

    @Column({ nullable: false })
    @AutoMap()
    description: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedDate: Date;

    @ManyToOne(() => UserEntity, (author) => author.articles)
    author: UserEntity;
}
