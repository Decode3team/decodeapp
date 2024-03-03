import { z } from 'zod';
import { DefinedApiClient } from '@/lib/defined/client';
import { router, publicProcedure } from '../trpc';
import { DefinedApiTokenClient } from '@/lib/defined/clients/token-client';
import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { ResolutionSchema } from '@/lib/zod-schema';

const client = DefinedApiClient.getInstance();
const tokenClient = new DefinedApiTokenClient(client);

export const tokensRouter = router({
  getTopTokens: publicProcedure
    .input(
      z.object({
        resolution: ResolutionSchema,
        networkId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      console.log(input);
      const res: DefinedApiTimeResolution = input.resolution || '1D';
      return await tokenClient.getTopTokens(res, input.networkId);
    }),

  getNewTokens: publicProcedure
    .input(
      z.object({
        networkId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await tokenClient.getNewTokens(input.networkId);
    }),
});
