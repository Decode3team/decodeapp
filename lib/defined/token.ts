import { DefinedApiClient } from './client';
import { RedisClient } from '@/lib/redis/client';
import { DefinedApiNetworkClient } from './network';
import { CacheKeys, TimeResolution } from '../constants';
import { DefinedApiTimeResolution, DefinedTopTokenModel } from './types';

export class DefinedApiTokenClient {
  private client!: DefinedApiClient;
  private redisClient!: RedisClient;

  constructor(client: DefinedApiClient) {
    this.client = client;
    this.redisClient = RedisClient.getInstance();
  }

  async getTopTokens(resolution: DefinedApiTimeResolution = '60', networkId?: number) {
    const cacheKey = 'getTopTokens' + CacheKeys.TOP_TOKEN[resolution] + `_${networkId}`;
    const existingData = await this.redisClient.get(cacheKey);

    if (existingData?.length && existingData.length > 0) {
      return JSON.parse(existingData) as DefinedTopTokenModel[];
    }

    const queryName = 'listTopTokens';
    const networkClient = new DefinedApiNetworkClient(this.client);
    const networks = await networkClient.getNetworks();
    const networkFilter = networks
      .filter((n) => (networkId ? n.id === networkId : true))
      .map((n) => n.id)
      .join(',');

    console.log(networks);

    return this.client
      .query<DefinedTopTokenModel[]>(
        queryName,
        `
            query {
                ${queryName}(
                    limit: 50
                    networkFilter: [${networkFilter}]
                    resolution: "${resolution}"
                ) {
                    name
                    symbol
                    address
                    imageSmallUrl
                    imageThumbUrl
                    imageLargeUrl
                    volume
                    liquidity
                    price
                    priceChange
                    priceChange1
                    priceChange4
                    priceChange12
                    priceChange24
                    txnCount1
                    txnCount4
                    txnCount12
                    txnCount24
                    marketCap
                }
            }`,
      )
      .then(async (res) => {
        const uniqueItems = res.reduce((acc, currentItem) => {
          if (!acc.has(currentItem.address)) {
            acc.set(currentItem.address, currentItem);
          }

          return acc;
        }, new Map());

        // Convert the Map values back to an array
        const filteredRes = Array.from(uniqueItems.values());

        await this.redisClient.set(
          CacheKeys.TOP_TOKEN[resolution],
          JSON.stringify(filteredRes),
          TimeResolution[5],
        );

        return filteredRes;
      });
  }

  async getTopTokensByMarketCap(resolution: DefinedApiTimeResolution = '60', networkId?: number) {
    const cacheKey = 'getTopTokensByMarketCap' + CacheKeys.TOP_TOKEN[resolution] + `_${networkId}`;
    const existingData = await this.redisClient.get(cacheKey);

    if (existingData?.length && existingData.length > 0) {
      return JSON.parse(existingData) as DefinedTopTokenModel[];
    }
  }
}
