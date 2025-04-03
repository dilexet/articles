import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1743666783685 implements MigrationInterface {
    name = 'InitialMigration1743666783685';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "articles"
                                 (
                                     "id"          uuid                     NOT NULL DEFAULT uuid_generate_v4(),
                                     "name"        character varying        NOT NULL,
                                     "description" character varying        NOT NULL,
                                     "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                     "updatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                     "authorId"    uuid,
                                     CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`CREATE TABLE "users"
                                 (
                                     "id"           uuid              NOT NULL DEFAULT uuid_generate_v4(),
                                     "name"         character varying NOT NULL,
                                     "email"        character varying NOT NULL,
                                     "passwordHash" character varying NOT NULL,
                                     CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
                                 )`);
        await queryRunner.query(`ALTER TABLE "articles"
            ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles"
            DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "articles"`);
    }
}
