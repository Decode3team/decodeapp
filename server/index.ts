import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { RedisClient } from "@/lib/redis/client";
import { BlockchainDataProvider } from "@/lib/providers/BlockchainDataProvider";
import { DiscoveryTokenData } from "@/lib/moralis/types";
import { TokenData } from "./models/TokenData";
import { formatNumber } from "@/lib/utils";
import { MoralisClient } from "@/lib/moralis/client";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    console.log("number");

    return [10, 20, 30];
  }),

  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ input }) => {
      return `Hello, ${input.name}`;
    }),

  // TODO CLEAN UP DUTY
  // APPLY CACHNING
  // SAVE TO DB
  discovery: publicProcedure.query(async () => {
    const httpOptions = {
      headers: {
        "accept": "application/json",
        "X-API-Key": process.env.MORALIS_API_KEY ?? "",
      },
    };

    const tempKey = "token_discovery";
    const redisClient = new RedisClient();
    const existingData = await redisClient.get(tempKey);

    if (existingData) return JSON.parse(existingData);

    const requests:Promise<DiscoveryTokenData[]>[] = []
    const dataProvider = new BlockchainDataProvider();
    const moralisClient = new MoralisClient();

    dataProvider
      .getData()
      .forEach((chain) => {
        requests.push(moralisClient.Discovery.getRisingLiquidityTokens({ chain: chain}))
        requests.push(moralisClient.Discovery.getTopBuyPressureTokens({ chain: chain}))
        requests.push(moralisClient.Discovery.getExperiencedBuyerTokens({ chain: chain}))
        requests.push(moralisClient.Discovery.getSolidPerformanceTokens({ chain: chain}))
        requests.push(moralisClient.Discovery.getBlueChipTokens({ chain: chain}))
        requests.push(moralisClient.Discovery.getRiskyBetTokens({ chain: chain}))
      });

    const responseData = await Promise.all(requests).then(d => d[0]);

    const uniqueTokenAddresses = new Set();
    const uniqueData = responseData.filter((d) => {
      if (!uniqueTokenAddresses.has(d)) {
        uniqueTokenAddresses.add(d.token_address);
        return true;
      }
      return false;
    });

    let total_market_cap = 0;
    let total_volume = 0;

    uniqueData.forEach(d => {
      total_market_cap += d.market_cap;
      total_volume += d.volume_change_usd["1d"];
    });

    const tokenData:TokenData = {
      total_market_cap: formatNumber(total_market_cap),
      total_volume: formatNumber(total_volume),
      tokens: uniqueData
    };
    
    await redisClient.set(tempKey, JSON.stringify(tokenData));
    return tokenData;
  }),
});

export type AppRouter = typeof appRouter;
