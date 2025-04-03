import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    migrationsTableName: 'migrations',
    entities: ['src/database/entities/index.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
