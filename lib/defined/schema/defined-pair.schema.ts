import { z } from 'zod';
import { definedPooledTokenValuesSchema } from '@/lib/defined/schema/defined-pooled-token-values.schema';
import { definedEnhancedTokenSchema } from '@/lib/defined/schema/defined-enhanced-token.schema';

export const definedPairSchema = z.object({
  address: z.string(),
  createdAt: z.number().optional(),
  exchangeHash: z.string(),
  fee: z.number().optional(),
  id: z.number(),
  networkId: z.number(),
  pooled: definedPooledTokenValuesSchema.optional(),
  tickSpacing: z.number().optional(),
  token0: z.string(),
  token0Data: definedEnhancedTokenSchema.optional(),
  token1: z.string(),
  token1Data: definedEnhancedTokenSchema.optional(),
});
export type DefinedPair = z.infer<typeof definedPairSchema>;
