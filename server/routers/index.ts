import { createCallerFactory, router } from '../trpc';
import { networksRouter } from './networks';
import { tokensRouter } from './tokens';

export const appRouter = router({
  networks: networksRouter,
  tokens: tokensRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
