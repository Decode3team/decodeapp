import { z } from 'zod';

export const definedNewTokenSchema = z.object({
  priceUSD: z.string(),
  liquidity: z.string(),
  marketCap: z.string(),
  uniqueTransactions1: z.number(),
  uniqueTransactions4: z.number(),
  uniqueTransactions12: z.number(),
  uniqueTransactions24: z.number(),
  change1: z.string(),
  change4: z.string(),
  change12: z.string(),
  change24: z.string(),
  volume1: z.string(),
  volume4: z.string(),
  volume12: z.string(),
  volume24: z.string(),
  token: z.object({
    name: z.string(),
    id: z.number(),
    address: z.string(),
    symbol: z.string(),
    info: z.object({
      imageLargeUrl: z.string().optional(),
      imageSmallUrl: z.string().optional(),
      imageThumbUrl: z.string().optional(),
    }),
  }),
});
export const definedNewTokenResultSchema = z.object({
  page: z.number(),
  count: z.number(),
  results: z.array(definedNewTokenSchema),
});

export type DefinedNewToken = z.infer<typeof definedNewTokenSchema>;
export type DefinedNewTokenResult = z.infer<typeof definedNewTokenResultSchema>;
