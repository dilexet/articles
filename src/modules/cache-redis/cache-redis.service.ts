import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheRedisService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async setCache<T>(key: string, value: T): Promise<T | null> {
        return await this.cacheManager.set(key, value);
    }

    async getCache<T>(key: string): Promise<T | null> {
        return await this.cacheManager.get(key);
    }

    async delCache(key: string): Promise<boolean> {
        return await this.cacheManager.del(key);
    }

    async clearCache(): Promise<boolean> {
        return await this.cacheManager.clear();
    }
}
