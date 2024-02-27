import axios from 'axios';
import { CacheKeys, TimeResolution } from '../constants';
import { BlockchainDataProvider } from '../providers/blockchain-data-provider';
import { DefinedApiClient } from './client';
import { DefinedNetworkModel } from './types';
import { RedisClient } from '@/lib/redis/client';

export class DefinedApiNetworkClient {
  private client!: DefinedApiClient;

  constructor(client: DefinedApiClient) {
    this.client = client;
  }

  async getNetworks() {
    const queryName = 'getNetworks';
    return this.client
      .query<DefinedNetworkModel[]>(
        queryName,
        `{
            ${queryName} {
              name
              id
            }
          }`,
      )
      .then(async (res) => {
        const redisClient = new RedisClient();
        const existingData = await redisClient.get(CacheKeys.NETWORK_DATA);
        if (existingData) return JSON.parse(existingData) as DefinedNetworkModel[];

        const dataProvider = new BlockchainDataProvider();
        const availableBlockChains = dataProvider.getData();
        const data = res.filter((d) => availableBlockChains.indexOf(d.name) !== -1);

        await redisClient.set(CacheKeys.NETWORK_DATA, JSON.stringify(data), TimeResolution[60]);
        return data;
      });
  }
}
