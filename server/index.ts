import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { DefinedApiClient } from '@/lib/defined/client';
import { DefinedApiTokenClient } from '@/lib/defined/token';
import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { ResolutionSchema } from '@/lib/zod-schema';
import { DefinedApiNetworkClient } from '@/lib/defined/network';

export const appRouter = router({
  'top-tokens': publicProcedure
    .input(
      z.object({
        resolution: ResolutionSchema,
        networkId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const client = DefinedApiClient.getInstance();
      const tokenClient = new DefinedApiTokenClient(client);
      const res: DefinedApiTimeResolution = input.resolution || '60';

      return await tokenClient.getTopTokens(res, input.networkId);
    }),
  'decode-networks': publicProcedure.query(async () => {
    const client = DefinedApiClient.getInstance();
    const networkClient = new DefinedApiNetworkClient(client);

    const data = await networkClient.getNetworks();

    return data;
  }),
});

export type AppRouter = typeof appRouter;
