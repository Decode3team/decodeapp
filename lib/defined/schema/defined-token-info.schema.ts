import { z } from 'zod';

export const definedTokenInfoSchema = z.object({
  address: z.string(),
  circulatingSupply: z.string(),
  cmcId: z.number(),
  id: z.string(),
  imageLargeUrl: z.string().nullable(),
  imageSmallUrl: z.string().nullable(),
  imageThumbUrl: z.string().nullable(),
  isScam: z.boolean(),
  name: z.string(),
  networkId: z.number(),
  symbol: z.string(),
  totalSupply: z.string(),
});
export type DefinedTokenInfo = z.infer<typeof definedTokenInfoSchema>;
