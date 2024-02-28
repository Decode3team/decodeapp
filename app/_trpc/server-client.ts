import { httpBatchLink } from '@trpc/client';
import { appRouter } from '@/server';
import { createCallerFactory } from '@/server/trpc';
import { hostUrl } from '@/lib/constants';

const createCaller = createCallerFactory(appRouter);

export const serverClient = createCaller({
  links: [
    httpBatchLink({
      url: `${hostUrl}/api/trpc`,
    }),
  ],
});
