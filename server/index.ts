//import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { RedisClient } from '@/lib/redis/client';
import { TokenData } from './models/TokenData';
import { formatNumber } from '@/lib/utils';
import { DefinedApiClient } from '@/lib/defined/client';
import { DefinedApiNetworkClient } from '@/lib/defined/network';
import { DefinedNetworkModel } from '@/lib/defined/types';
import { DefinedApiTokenClient } from '@/lib/defined/token';

export const appRouter = router({
  // hello: publicProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //     }),
  //   )
  //   .query(async ({ input: any }) => {
  //     return `Hello, ${input.name}`;
  //   }),

  // TODO: CLEAN UP DUTY
  // TODO: SAVE TO DB
  ['top-tokens']: publicProcedure
    // .input(
    //   z.object({
    //     resolution: z.string(),
    //   })
    // )
    .query(async () => {
      const client = new DefinedApiClient();
      const tokenClient = new DefinedApiTokenClient(client);
      return tokenClient.getTopTokens();
    }),
});

export type AppRouter = typeof appRouter;
