import { AppRouter } from '@/server/routers';
import { createWSClient, httpLink, loggerLink, splitLink, wsLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { ssrPrepass } from '@trpc/next/ssrPrepass';
import type { inferRouterOutputs } from '@trpc/server';
import superjson from 'superjson';
import { httpApiHostUrl, wsApiHostUrl } from '../constants';

const client = createWSClient({
  url: `${wsApiHostUrl}/api/trpc`,
});

const wsClientLink = wsLink({
  client,
  transformer: superjson,
});

export const trpc = createTRPCNext<AppRouter>({
  ssr: true,
  ssrPrepass,
  config({ ctx }) {
    return {
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition: (operation) => {
            return operation.type === 'subscription';
          },
          true: wsClientLink,
          false: httpLink({
            url: `${httpApiHostUrl}/api/trpc`,
          }),
        }),
      ],
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60000 } } },
    };
  },
  transformer: superjson,
});

export type RouterOutputs = inferRouterOutputs<AppRouter>;
