import Redis from 'ioredis';

export class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_ENDPOINT ?? 'redis',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    });
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
