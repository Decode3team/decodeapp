import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { RedisClient } from "@/lib/redis/client";

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
          'accept': 'application/json',
          'X-API-Key': process.env.MORALIS_API_KEY
      }
    };

    const tempKey = "token_discovery";
    const redisClient = new RedisClient();
    const existingData = await redisClient.get(tempKey);

    if(existingData)
      return JSON.parse(existingData);

    const requests = [];
    const chains = ["eth", "polygon", "binance", "arbitrum", "optimism", "fantom", "pulsechain"];

    chains.forEach(chain => {      
      requests.push(fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/rising-liquidity?chain=${chain}`, httpOptions).then(res => res.json()));
      requests.push(fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/buying-pressure?chain=${chain}`, httpOptions).then(res => res.json()));
      requests.push(fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/experienced-buyers?chain=${chain}`, httpOptions).then(res => res.json()));
      requests.push(fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/solid-performers?chain=${chain}`, httpOptions).then(res => res.json()));
      requests.push(fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/blue-chip?chain=${chain}`, httpOptions).then(res => res.json()));
      requests.push(fetch(`https://deep-index.moralis.io/api/v2.2/discovery/tokens/risky-bets?chain=${chain}`, httpOptions).then(res => res.json()));
    });
    
    const responseData = await Promise.all(requests);
    const uniqueData = Array.from(new Set(responseData.map(d => d.token_address)))
                           .map(token_address => responseData.find(d => d.token_address === token_address));

    await redisClient.set(tempKey, JSON.stringify(uniqueData));
    return uniqueData;
  })
});

export type AppRouter = typeof appRouter;
