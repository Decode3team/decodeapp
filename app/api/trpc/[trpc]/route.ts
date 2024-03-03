/**
 * This file contains the tRPC http response handler and context creation for Next.js
 */
import { AppRouter, appRouter } from '@/server/routers';
import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from 'server/context';

export default trpcNext.createNextApiHandler<AppRouter>({
  router: appRouter,
  /**
   * @link https://trpc.io/docs/v11/context
   */
  createContext,
  /**
   * @link https://trpc.io/docs/v11/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },
});
