import { Redis, RedisOptions } from 'ioredis';
import { TimeResolution } from '../constants';
export class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_ENDPOINT ?? 'redis',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
      password: process.env.REDIS_PASSWORD,
    });
  }

  getClient() {
    return this.client;
  }

  async set(key: string, value: string, expirationInSeconds?: number) {
    try {
      const args: [string, string | number] = [key, value];

      if (expirationInSeconds) {
        args.push(...['EX', expirationInSeconds]);
      }

      await this.client.set(...args);
    } catch (error) {
      this.quit();
      throw error;
    }
  }

  async get(key: string) {
    const result = await this.client.get(key);

    return result;
  }

  async getOrSet<T>(
    key: string,
    dataFn: () => Promise<T>,
    expirationInSeconds: number = TimeResolution[5],
  ) {
    const cachedData = await this.client.get(key);

    if (cachedData) {
      return JSON.parse(cachedData) as T;
    }

    const newData = await dataFn();

    await this.set(key, JSON.stringify(newData), expirationInSeconds);

    return newData;
  }

  async quit() {
    await this.client.quit();
  }
}
