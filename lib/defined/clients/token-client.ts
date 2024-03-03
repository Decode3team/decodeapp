import { DefinedApiClient, GqlTag } from '../client';
import { RedisClient } from '@/lib/redis/client';
import { CacheKeys } from '../../constants';
import { DefinedApiTimeResolution } from '../types';
import { DefinedTopToken } from '../schema/defined-top-token.schema';
import { DefinedNewToken, DefinedNewTokenResult } from '../schema/defined-new-token.schema';
import { DefinedApiNetworkClient } from './network-client';

export class DefinedApiTokenClient {
  private client!: DefinedApiClient;
  private redisClient!: RedisClient;

  constructor(client: DefinedApiClient) {
    this.client = client;
    this.redisClient = RedisClient.getInstance();
  }

  private async getNetworkFilters(networkId?: number) {
    const networkClient = new DefinedApiNetworkClient(this.client);
    const networks = await networkClient.getNetworks();
    const networkFilter = networks
      .filter((n) => (networkId ? n.id === networkId : true))
      .map((n) => n.id);

    return networkFilter;
  }

  async getTopTokens(
    resolution: DefinedApiTimeResolution = '60',
    networkId?: number,
  ): Promise<DefinedTopToken[]> {
    const cacheKey = 'getTopTokens' + CacheKeys.TOP_TOKEN[resolution] + `_${networkId}`;

    return this.redisClient.getOrSet(cacheKey, async () => {
      const queryName = 'listTopTokens';
      const networkFilter = await this.getNetworkFilters(networkId);

      return this.client
        .query<DefinedTopToken[]>(
          queryName,
          GqlTag`
          query ($networkFilter: [Int!], $limit: Int, $resolution: String) {
            ${queryName}(networkFilter: $networkFilter, limit: $limit, resolution: $resolution) {
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
          {
            networkFilter,
            limit: 50,
            resolution,
          },
        )
        .then((res) => {
          const uniqueItems = res.reduce((acc, currentItem) => {
            if (!acc.has(currentItem.address)) {
              acc.set(currentItem.address, currentItem);
            }

            return acc;
          }, new Map());

          return Array.from(uniqueItems.values());
        });
    });
  }

  async getTopTokensByMarketCap(resolution: DefinedApiTimeResolution = '60', networkId?: number) {
    const cacheKey = 'getTopTokensByMarketCap' + CacheKeys.TOP_TOKEN[resolution] + `_${networkId}`;
    const existingData = await this.redisClient.get(cacheKey);

    if (existingData?.length && existingData.length > 0) {
      return JSON.parse(existingData) as DefinedTopToken[];
    }
  }

  async getNewTokens(networkId?: number): Promise<DefinedNewToken[]> {
    const cacheKey = `getNewTokens_${networkId}`;

    return this.redisClient.getOrSet(cacheKey, async () => {
      const queryName = 'filterTokens';
      const networkFilter = await this.getNetworkFilters(networkId);

      return this.client
        .query<DefinedNewTokenResult>(
          queryName,
          GqlTag`
          query ($networkFilter: [Int!], $limit: Int) {
            ${queryName} (
              filters: {
                network: $networkFilter, 
                liquidity:{
                  gte: 100000
                },
                marketCap:{
                  lte: 100000000000
                },
                priceUSD:{
                gte: 0.00000000001
              }
              }
              rankings: {
                attribute: createdAt, 
                direction: DESC
              }
              limit: $limit,
            ) {
              results {
                priceUSD,
                liquidity,
                marketCap,
                uniqueTransactions1,
                uniqueTransactions4,
                uniqueTransactions12,
                uniqueTransactions24,
                change1,
                change4,
                change12,
                change24
                liquidity,
                volume1,
                volume4,
                volume12,
                volume24
                token {
                  name,
                  id,
                  address,
                  symbol
                  info {
                    imageLargeUrl,
                    imageSmallUrl
                    imageThumbUrl
                  }
                },
              }
            }
          }`,
          {
            networkFilter,
            limit: 50,
          },
        )
        .then((res) => {
          const { results } = res;
          const uniqueItems = results.reduce((acc, currentItem) => {
            if (!acc.has(currentItem.token.address)) {
              acc.set(currentItem.token.address, currentItem);
            }

            return acc;
          }, new Map());

          return Array.from(uniqueItems.values());
        });
    });
  }
}
