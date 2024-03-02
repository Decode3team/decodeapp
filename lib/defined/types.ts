import { ApiTimeResolutionValue } from '../constants';

export type DefinedApiResponse<T> = {
  [key: string]: T;
};

export type DefinedNetworkModel = {
  id: number;
  name: string;
  logo: string;
  nameString: string;
};

export type DefinedTopTokenModel = {
  name: string;
  symbol: string;
  address: string;
  imageLargeUrl?: string;
  imageSmallUrl?: string;
  imageThumbUrl?: string;
  volume: string;
  liquidity: string;
  price: number;
  priceChange: number;
  priceChange1: number;
  priceChange4: number;
  priceChange12: number;
  priceChange24: number;
  txnCount1: number;
  txnCount4: number;
  txnCount12: number;
  txnCount24: number;
  marketCap: string;
};

export type DefinedApiTimeResolution =
  (typeof ApiTimeResolutionValue)[keyof typeof ApiTimeResolutionValue];
