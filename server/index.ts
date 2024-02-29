import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { DefinedApiClient } from '@/lib/defined/client';
import { DefinedApiTokenClient } from '@/lib/defined/token';
import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { ResolutionSchema } from '@/lib/zod-schema';
import { DefinedApiNetworkClient } from '@/lib/defined/network';

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
  'top-tokens': publicProcedure
    .input(
      z.object({
        resolution: ResolutionSchema,
      }),
    )
    .query(async ({ input }) => {
      const client = DefinedApiClient.getInstance();
      const tokenClient = new DefinedApiTokenClient(client);
      const res: DefinedApiTimeResolution = input.resolution || '60';

      return await tokenClient.getTopTokens(res);
    }),
  'decode-networks': publicProcedure.query(async () => {
    const client = DefinedApiClient.getInstance();
    const networkClient = new DefinedApiNetworkClient(client);

    const data = await networkClient.getNetworks();

    console.log('>>', data);

    return data;
  }),
});

export type AppRouter = typeof appRouter;
