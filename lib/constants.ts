import { DefinedApiTimeResolution } from './defined/types';

export const apiPort = process.env.PUBLIC_WEBSOCKET_HOST_PORT
  ? Number(process.env.PUBLIC_WEBSOCKET_HOST_PORT)
  : 3001;

export const hostPort = process.env.NEXT_PUBLIC_HOST_PORT
  ? Number(process.env.NEXT_PUBLIC_HOST_PORT)
  : 3000;

export const hostDomain = process.env.NEXT_PUBLIC_HOST_DOMAIN ?? 'localhost';
export const apiDomain = process.env.PUBLIC_API_HOST_DOMAIN ?? 'localhost';

export const wsApiHostUrl = `ws://${apiDomain}:${apiPort}`;
export const httpApiHostUrl = `http://${apiDomain}:${apiPort}`;
export const hostUrl = `http://${hostDomain}:${hostPort}`;
export const apiHostUrlPrefix = '/api/trpc';

const getNetworkIdCacheKeyFragment = (networkId?: number) => {
  if (!networkId) {
    return '';
  }

  return `:ntwrkId:${networkId}`;
};

export namespace CacheKeys {
  export const NETWORK_DATA = 'dfi_ntwk_data';

  export const NEW_TOKEN = (networkId?: number) => {
    return `dfi_new_tkn` + getNetworkIdCacheKeyFragment(networkId);
  };

  export const TOP_TOKEN = (resoltuion: DefinedApiTimeResolution, networkId?: number) => {
    return `dfi_top_tkn:${resoltuion}` + getNetworkIdCacheKeyFragment(networkId);
  };

  export const TOP_TOKEN_BY_MARKETCAP = (
    resoltuion: DefinedApiTimeResolution,
    networkId?: number,
  ) => {
    return `dfi_top_tkn_mkt_cap:${resoltuion}` + getNetworkIdCacheKeyFragment(networkId);
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
  bsc: 'Binance',
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
