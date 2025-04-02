import { Injectable } from '@nestjs/common';
import { CacheRedisService } from '../cache-redis/cache-redis.service';

@Injectable()
export class AppService {
    constructor(private readonly cacheService: CacheRedisService) {}

    async getHello(): Promise<string[]> {
        const cacheKey = 'app_key_cache';
        const usersString: string | null = await this.cacheService.getCache<string>(cacheKey);

        console.log('Cache data:', usersString);

        if (!usersString) {
            console.log('Данных нет в кеше, загружаем...');
            const users = ['Alice', 'Bob', 'Charlie'];
            await this.cacheService.setCache(cacheKey, JSON.stringify(users));

            return users;
        } else {
            console.log('Получаем данные из кеша');
        }

        return JSON.parse(usersString) as string[];
    }
}
