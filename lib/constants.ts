import { DefinedApiTimeResolution } from './defined/types';

export const hostUrl = process.env.NEXT_PUBLIC_HOST_URL ?? 'http://localhost:3000';

export namespace CacheKeys {
  export const NETWORK_DATA = 'dfi_ntwk_data';

  export const TOP_TOKEN: Record<DefinedApiTimeResolution, string> = {
    '1': 'dfi_top_tkn_1m',
    '5': 'dfi_top_tkn_5m',
    '15': 'dfi_top_tkn_15m',
    '30': 'dfi_top_tkn_30m',
    '60': 'dfi_top_tkn_60m',
    '240': 'dfi_top_tkn_240m',
    '720': 'dfi_top_tkn_720m',
    '1D': 'dfi_top_tkn_1D',
  };
}

export const TimeResolution: Record<DefinedApiTimeResolution, number> = {
  '1': 60,
  '5': 300,
  '15': 900,
  '30': 1800,
  '60': 3600,
  '240': 14400,
  '720': 43200,
  '1D': 86400,
};

export const ApiTimeResolutionValue = {
  '1': '1', // 1 minute
  '5': '5', // 5 minute
  '15': '15', // 15 minute
  '30': '30', // 30 minute
  '60': '60', // 1 hour
  '240': '240', // 4 hour
  '720': '720', // 12 hour
  '1D': '1D', // 24 hour
} as const;

export const NetworkNames = {
  eth: 'Ethereum',
  polygon: 'Polygon',
  binance: 'Binance',
  arbitrum: 'Arbitrum',
  base: 'Base',
  optimism: 'Optimism',
  blast: 'Blast',
  avalanche: 'Avalanche',
  fantom: 'Fantom',
  mantle: 'Mantle',
  moonbeam: 'Moonbeam',
  celo: 'Celo',
};
