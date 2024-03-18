import { z } from 'zod';
import RedisManager from '@/lib/redis/manager';
import { DefinedHttpApiClient } from '@/lib/defined/http/client';
import { DefinedHttpApiTokenClient } from '@/lib/defined/http/clients/token-client';
import { definedFilterTokenParamSchema } from '@/lib/defined/schema/defined-filter-token.schema';
import { publicProcedure, router } from '@/server/trpc';

const redisManager = RedisManager.getInstance();
const redisClient = redisManager.getClient();

const httpClient = DefinedHttpApiClient.getInstance();
const httpTokenClient = new DefinedHttpApiTokenClient(httpClient, redisClient);

export const httpTokenRoutes = router({
  getNewTokes: publicProcedure
    .input(
      z.object({
        networkId: z.number().optional(),
        cursor: z.number().nullish(), // is the offset
      }),
    )
    .query(async ({ input }) => {
      const { cursor = 0, networkId } = input;
      const offset = cursor ?? 0;

      const items = await httpTokenClient.getNewTokens(networkId, offset);

      return {
        items,
        nextCursor: offset + items.length,
      };
    }),

  getLatestTokens: publicProcedure
    .input(
      z.object({
        networkId: z.number().optional(),
        cursor: z.number().nullish(), // is the offset
      }),
    )
    .query(async ({ input }) => {
      const { cursor = 0, networkId } = input;
      const offset = cursor ?? 0;

      const items = await httpTokenClient.getLatestTokens(networkId, offset, 50);

      return {
        items,
        nextCursor: offset + items.length,
      };
    }),

  getTokensByMarketCap: publicProcedure
    .input(
      z.object({
        networkId: z.number().optional(),
        volume: z.string().optional(),
        cursor: z.number().nullish(), // is the offset
      }),
    )
    .query(async ({ input }) => {
      const { cursor = 0, networkId } = input;
      const offset = cursor ?? 0;

      const items = await httpTokenClient.getTokensByMarketCap({
        networkId,
        offset,
        limit: 50,
      });

      return {
        items,
        nextCursor: offset + items.length,
      };
    }),

  filterTokens: publicProcedure.input(definedFilterTokenParamSchema).query(async ({ input }) => {
    return await httpTokenClient.filterTokens(input);
  }),
});
