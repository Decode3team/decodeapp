import { DiscoveryTokenData } from '@/lib/moralis/types';

export type TokenData = {
  total_market_cap: string;
  total_volume: string;
  tokens: DiscoveryTokenData[];
};
