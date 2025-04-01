import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { AutoMap } from '@automapper/classes';
import { ArticleEntity } from './article.entity';

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

    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[];
}
