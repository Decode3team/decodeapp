import { z } from 'zod';
import { DefinedApiClient } from '@/lib/defined/client';
import { router, publicProcedure } from '../trpc';
import { DefinedApiTokenClient } from '@/lib/defined/clients/token-client';
import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { ResolutionSchema } from '@/lib/zod-schema';
import { observable } from '@trpc/server/observable';
import { DefinedTopToken } from '@/lib/defined/schema/defined-top-token.schema';
import RedisManager from '@/lib/redis/manager';
import { DefinedNewToken } from '@/lib/defined/schema/defined-new-token.schema';

const redisManager = RedisManager.getInstance();
const redisClient = redisManager.getClient();
const redisSubscriberClient = redisManager.getSubscriberClient().getClient();

const apiClient = DefinedApiClient.getInstance();
const tokenClient = new DefinedApiTokenClient(apiClient, redisClient);

export const tokensRouter = router({
  getTopTokens: publicProcedure
    .input(
      z.object({
        resolution: ResolutionSchema,
        networkId: z.number().optional(),
      }),
    )
    .subscription(async ({ input }) => {
      const resolution: DefinedApiTimeResolution = input.resolution || '1D';
      const eventName = `top-tkn-updated:${resolution}:ntrwkId:${input.networkId}`;

      return observable<DefinedTopToken[]>((emit) => {
        tokenClient.getTopTokensFromCache(resolution, input.networkId).then((res) => {
          emit.next(res);
        });

        redisSubscriberClient.subscribe(eventName).then(() => {
          redisSubscriberClient.on('message', (channel, message) => {
            if (message) {
              console.log(`Received message from event:${channel}`);
              const data = JSON.parse(message) as DefinedTopToken[];

              emit.next(data);
            }
          });
        });

        return () => {
          console.log(`Unsubscribing to event:${eventName}`);
          redisSubscriberClient.unsubscribe(eventName);
        };
      });
    }),
  getNewTokens: publicProcedure
    .input(
      z.object({
        networkId: z.number().optional(),
      }),
    )
    .subscription(async ({ input }) => {
      return observable<DefinedNewToken[]>((emit) => {
        tokenClient.getNewTokensFromCache(input.networkId).then((res) => {
          emit.next(res);
        });

        return () => {};
      });
    }),
});
