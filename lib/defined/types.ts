import { ApiTimeResolutionValue } from '../constants';

export type DefinedApiResponse<T> = {
  [key: string]: T;
};

export type DefinedApiTimeResolution =
  (typeof ApiTimeResolutionValue)[keyof typeof ApiTimeResolutionValue];

export type PairId = `${string}:${string}`;
export type TokenOfInterest = 'token0' | 'token1';

export type DefinedWebsocketResponse<T> = {
  data: {
    [key: string]: T;
  };
};
