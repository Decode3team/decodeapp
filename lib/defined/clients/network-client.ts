import { CacheKeys, NetworkNames, TimeResolution } from '../../constants';
import { BlockchainDataProvider } from '../../providers/blockchain-data-provider';
import { DefinedApiClient, GqlTag } from '../client';
import { DefinedNetwork } from '../schema/defined-network.schema';
import { RedisClient } from '@/lib/redis/client';

export class DefinedApiNetworkClient {
  private client!: DefinedApiClient;

  constructor(client: DefinedApiClient) {
    this.client = client;
  }

  async getNetworks() {
    const queryName = 'getNetworks';
    const redisClient = RedisClient.getInstance();

    return redisClient.getOrSet(
      CacheKeys.NETWORK_DATA,
      async () => {
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
      },
      TimeResolution['1D'],
    );
  }
}
