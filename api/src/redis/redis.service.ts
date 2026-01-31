import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

if (!REDIS_URL) {
    throw new Error('REDIS_URL environment variable is not set');
}

@Injectable()
export class RedisService implements OnModuleDestroy {
    private client: Redis;

    constructor() {
        this.client = new Redis(String(REDIS_URL));
    }

    getClient() {
        return this.client;
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
