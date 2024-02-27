import Redis from 'ioredis';

export class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_ENDPOINT ?? 'redis',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    });
  }

  async set(key: string, value: any, expirationInSeconds?: number) {
    try {
      const args: [string, any] = [key, value];
      if (expirationInSeconds) {
        args.push(...["EX", expirationInSeconds])
      }
      await this.client.set(...args);
      console.log(`Key "${key}" set with value "${value}"`);
    } catch (error) {
      console.error('Error setting key:', error);
    }
  }

  async get(key: string) {
    try {
      const result = await this.client.get(key);
      console.log(`Value of key "${key}":`, result);
      return result;
    } catch (error) {
      console.error('Error getting key:', error);
    }
  }

  quit() {
    this.client.quit();
  }
}
