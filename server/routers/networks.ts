import { DefinedApiClient } from '@/lib/defined/client';
import { router, publicProcedure } from '../trpc';
import { DefinedApiNetworkClient } from '@/lib/defined/clients/network-client';

const client = DefinedApiClient.getInstance();
const networkClient = new DefinedApiNetworkClient(client);

export const networksRouter = router({
  getNetworks: publicProcedure.query(async () => {
    return await networkClient.getNetworks();
  }),
});
