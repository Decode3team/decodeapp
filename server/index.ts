import { z } from 'zod';

import { MoralisClient } from '@/lib/moralis/client';
import { RedisClient } from '@/lib/redis/client';
import { formatNumber } from '@/lib/utils';

import { TokenData } from './models/TokenData';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return `Hello, ${input.name}`;
    }),

  // TODO: CLEAN UP DUTY
  // TODO: SAVE TO DB
  discovery: publicProcedure.query(async () => {
    const tempKey = 'token_discovery';
    const redisClient = new RedisClient();
    const existingData = await redisClient.get(tempKey);

    if (existingData) return JSON.parse(existingData) as TokenData;

    const moralisClient = new MoralisClient();
    const responseData = await moralisClient.Discovery.getAllTokenData();

    const uniqueTokenAddresses = new Set();
    const uniqueData = responseData.filter((d) => {
      if (!uniqueTokenAddresses.has(d)) {
        uniqueTokenAddresses.add(d.token_address);

        return true;
      }

      return false;
    });

    let total_market_cap = 0;
    let total_volume = 0;

    uniqueData.forEach((d) => {
      total_market_cap += d.market_cap;
      total_volume += d.volume_change_usd['1d'];
    });

    const tokenData: TokenData = {
      total_market_cap: formatNumber(total_market_cap),
      total_volume: formatNumber(total_volume),
      tokens: uniqueData,
    };

    await redisClient.set(tempKey, JSON.stringify(tokenData));

    return tokenData;
  }),
});
