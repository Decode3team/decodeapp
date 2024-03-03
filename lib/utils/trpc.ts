import { AppRouter } from '@/server/routers';
import type { TRPCLink } from '@trpc/client';
import { createWSClient, httpBatchLink, loggerLink, wsLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { ssrPrepass } from '@trpc/next/ssrPrepass';
import type { inferRouterOutputs } from '@trpc/server';
import type { NextPageContext } from 'next';
import superjson from 'superjson';
import { hostUrl, wssHostUrl } from '../constants';

function getEndingLink(ctx: NextPageContext | undefined): TRPCLink<AppRouter> {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      transformer: superjson,
      url: `${hostUrl}/api/trpc`,
      headers() {
        if (!ctx?.req?.headers) {
          return {};
        }
        return {
          ...ctx.req.headers,
          'x-ssr': '1',
        };
      },
    });
  }
  const client = createWSClient({
    url: wssHostUrl,
  });

  return wsLink({
    client,
    transformer: superjson,
  });
}

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
        getEndingLink(ctx),
      ],
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  transformer: superjson,
});

export type RouterOutputs = inferRouterOutputs<AppRouter>;
