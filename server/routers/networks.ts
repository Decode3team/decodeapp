import { DefinedApiClient } from '@/lib/defined/client';
import { router, publicProcedure } from '../trpc';
import { DefinedApiNetworkClient } from '@/lib/defined/clients/network-client';
import RedisManager from '@/lib/redis/manager';

const redisManager = RedisManager.getInstance();
const redisClient = redisManager.getClient();

const apiClient = DefinedApiClient.getInstance();
const networkClient = new DefinedApiNetworkClient(apiClient, redisClient);

export const networksRouter = router({
  getNetworks: publicProcedure.query(async () => {
    return await networkClient.getNetworksFromCache();
  }),
});
