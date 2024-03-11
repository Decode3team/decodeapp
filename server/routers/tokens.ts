import { z } from 'zod';

import { router, publicProcedure } from '../trpc';
import { ResolutionSchema } from '@/lib/zod-schema';
import { observable } from '@trpc/server/observable';
import { DefinedTopToken } from '@/lib/defined/schema/defined-top-token.schema';
import RedisManager from '@/lib/redis/manager';
import { DefinedHttpApiClient } from '@/lib/defined/http/client';
import { DefinedHttpApiTokenClient } from '@/lib/defined/http/clients/token-client';
import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { DefinedOnPairMetadataUpdated } from '@/lib/defined/schema/websocket/defined-onpairmetadataupdated-schema';
import { DefinedWebsocketApiClient } from '@/lib/defined/websocket/client';
import { DefinedWebsocketApiTokenClient } from '@/lib/defined/websocket/clients/token-client';

const redisManager = RedisManager.getInstance();
const redisClient = redisManager.getClient();
const redisSubscriberClient = redisManager.getSubscriberClient().getClient();

const httpClient = DefinedHttpApiClient.getInstance();
const httpTokenClient = new DefinedHttpApiTokenClient(httpClient, redisClient);

const websocketClient = DefinedWebsocketApiClient.getInstance();
const wsTokenClient = new DefinedWebsocketApiTokenClient(websocketClient);

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
        httpTokenClient.getTopTokensFromCache(resolution, input.networkId).then((res) => {
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
  onPairMetadatUpdated: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
        networkId: z.number(),
      }),
    )
    .subscription(({ input }) => {
      return observable<DefinedOnPairMetadataUpdated>((emit) => {
        const observer = wsTokenClient.onPairMetadataUpdated(input.tokenAddress, input.networkId);

        const subscription = observer.subscribe({
          next: (data) => {
            emit.next(data);
          },
        });

        return () => {
          subscription.unsubscribe();
        };
      });
    }),

  getNewTokes: publicProcedure
    .input(
      z.object({
        resolution: ResolutionSchema,
        networkId: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await httpTokenClient.getNewTokens(input.networkId);
    }),
});
