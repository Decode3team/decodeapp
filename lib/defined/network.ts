import { CacheKeys, NetworkNames, TimeResolution } from '../constants';
import { BlockchainDataProvider } from '../providers/blockchain-data-provider';
import { DefinedApiClient, GqlTag } from './client';
import { DefinedNetworkModel } from './types';
import { RedisClient } from '@/lib/redis/client';

export class DefinedApiNetworkClient {
  private client!: DefinedApiClient;

  constructor(client: DefinedApiClient) {
    this.client = client;
  }

  async getNetworks() {
    const queryName = 'getNetworks';
    const redisClient = RedisClient.getInstance();
    const existingData = await redisClient.get(CacheKeys.NETWORK_DATA);

    if (existingData) {
      return JSON.parse(existingData) as DefinedNetworkModel[];
    }

    return this.client
      .query<DefinedNetworkModel[]>(
        queryName,
        GqlTag`{
            ${queryName} {
              name
              id
            }
          }`,
      )
      .then(async (res) => {
        const dataProvider = new BlockchainDataProvider();
        const availableBlockChains = dataProvider.getData();
        const data = res
          .filter((d) => availableBlockChains.indexOf(d.name) !== -1)
          .map((d) => {
            return {
              ...d,
              ...{
                logo: `/logos/networks/${d.name}.png`,
                nameString: NetworkNames[d.name as keyof typeof NetworkNames] || d.name,
              },
            };
          });

        await redisClient.set(CacheKeys.NETWORK_DATA, JSON.stringify(data), TimeResolution['1D']);

        return data;
      });
  }
}
