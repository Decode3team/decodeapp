import { Redis, RedisOptions } from 'ioredis';

export class RedisClient {
  private client: Redis;

  constructor() {
    const redisOptions: RedisOptions = {
      host: process.env.REDIS_ENDPOINT ?? 'redis',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
      password: process.env.REDIS_PASSWORD,
    };

    this.client = new Redis(redisOptions);
  }

  async set(key: string, value: string, expirationInSeconds?: number) {
    const args: [string, string | number] = [key, value];

    if (expirationInSeconds) {
      args.push(...['EX', expirationInSeconds]);
    }

    await this.client.set(...args);
  }

  async get(key: string) {
    const result = await this.client.get(key);

    return result;
  }

  quit() {
    this.client.quit();
  }
}
