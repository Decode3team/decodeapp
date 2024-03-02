import { ApiTimeResolutionValue } from '../constants';

export type DefinedApiResponse<T> = {
  [key: string]: T;
};

export type DefinedApiTimeResolution =
  (typeof ApiTimeResolutionValue)[keyof typeof ApiTimeResolutionValue];
