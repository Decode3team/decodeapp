import { DefinedHttpApiClient } from '../client';
import { CacheKeys } from '../../../constants';
import { DefinedApiTimeResolution } from '../../types';
import { DefinedTopToken } from '../../schema/defined-top-token.schema';
import { DefinedNewToken, DefinedNewTokenResult } from '../../schema/defined-new-token.schema';
import { DefinedHttpApiNetworkClient } from './network-client';
import { RedisClient } from '@/lib/redis/client';
import { gql as GqlTag } from 'graphql-request';

export class DefinedHttpApiTokenClient {
  private client!: DefinedHttpApiClient;
  private redisClient!: RedisClient;

  constructor(client: DefinedHttpApiClient, redisClient: RedisClient) {
    this.client = client;
    this.redisClient = redisClient;
  }

  private async getNetworkFilters(networkId?: number) {
    const networkClient = new DefinedHttpApiNetworkClient(this.client, this.redisClient);
    const networks = await networkClient.getNetworksFromCache();
    const networkFilter = networks
      .filter((n) => (networkId ? n.id === networkId : true))
      .map((n) => n.id);

    return networkFilter;
  }

  /**
   * Retrieves the top tokens based on the given resolution and network ID.
   *
   * @param {DefinedApiTimeResolution} resolution - The time resolution for the token data (default: '60')
   * @param {number} networkId - The ID of the network (optional)
   * @return {Promise<DefinedTopToken[]>} A promise that resolves to an array of DefinedTopToken objects
   */
  async getTopTokens(
    resolution: DefinedApiTimeResolution = '60',
    networkId?: number,
  ): Promise<DefinedTopToken[]> {
    const queryName = 'listTopTokens';
    const networkFilter = await this.getNetworkFilters(networkId);

    return await this.client
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
  }

  /**
   * Retrieve top tokens from cache for a given time resolution and network ID.
   *
   * @param {DefinedApiTimeResolution} resolution - the time resolution for token retrieval
   * @param {number} [networkId] - optional network ID for token retrieval
   * @return {Promise<DefinedTopToken[]>} the top tokens from cache
   */
  async getTopTokensFromCache(
    resolution: DefinedApiTimeResolution = '60',
    networkId?: number,
  ): Promise<DefinedTopToken[]> {
    const cacheKey = CacheKeys.TOP_TOKEN(resolution, networkId);

    return await this.redisClient.getOrSet(cacheKey, async () =>
      this.getTopTokens(resolution, networkId),
    );
  }

  async getTopTokensByMarketCap(resolution: DefinedApiTimeResolution = '60', networkId?: number) {
    const cacheKey = CacheKeys.TOP_TOKEN_BY_MARKETCAP(resolution, networkId);
    const existingData = await this.redisClient.get<DefinedTopToken[]>(cacheKey);

    return existingData ?? [];
  }

  async getNewTokens(networkId?: number): Promise<DefinedNewToken[]> {
    const queryName = 'filterTokens';
    const networkFilter = await this.getNetworkFilters(networkId);

    return await this.client
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
  }

  async getNewTokensFromCache(networkId?: number): Promise<DefinedNewToken[]> {
    const cacheKey = CacheKeys.NEW_TOKEN(networkId);

    return await this.redisClient.getOrSet(cacheKey, async () => this.getNewTokens(networkId));
  }
}
