import RedisManager from '@/lib/redis/manager';
import { CacheKeys, NetworkNames, TimeResolution } from '../../constants';
import { BlockchainDataProvider } from '../../providers/blockchain-data-provider';
import { DefinedApiClient, GqlTag } from '../client';
import { DefinedNetwork } from '../schema/defined-network.schema';
import { RedisClient } from '@/lib/redis/client';

export class DefinedApiNetworkClient {
  private client!: DefinedApiClient;
  private redisClient!: RedisClient;

  constructor(client: DefinedApiClient, redisClient: RedisClient) {
    this.client = client;
    this.redisClient = redisClient;
  }

  async getNetworks() {
    const queryName = 'getNetworks';
    const res = await this.client.query<DefinedNetwork[]>(
      queryName,
      GqlTag`{
              ${queryName} {
              name
              id
              }
          }`,
    );

    const dataProvider = new BlockchainDataProvider();
    const availableBlockChains = dataProvider.getData();

    return res
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
  }

  async getNetworksFromCache() {
    return await this.redisClient.getOrSet(
      CacheKeys.NETWORK_DATA,
      () => this.getNetworks(),
      TimeResolution['1D'],
    );
  }
}
