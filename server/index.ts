import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { DefinedApiClient } from '@/lib/defined/client';
import { DefinedApiTokenClient } from '@/lib/defined/token';
import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { ResolutionSchema } from '@/lib/zod-schema';

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
      const client = new DefinedApiClient();
      const tokenClient = new DefinedApiTokenClient(client);
      const res: DefinedApiTimeResolution = input.resolution || '60';

      return tokenClient.getTopTokens(res);
    }),
});

export type AppRouter = typeof appRouter;
