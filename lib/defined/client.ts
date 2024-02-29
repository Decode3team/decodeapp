import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DefinedApiResponse } from '@/lib/defined/types';

export class DefinedApiClient {
  private static instance: DefinedApiClient;
  private client!: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: process.env.DEFINED_API_URL ?? '',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.DEFINED_API_KEY ?? '',
      },
    });
  }

  public static getInstance(): DefinedApiClient {
    if (!DefinedApiClient.instance) {
      DefinedApiClient.instance = new DefinedApiClient();
    }

    return DefinedApiClient.instance;
  }

  async query<T>(operationName: string, query: string): Promise<T> {
    try {
      return this.client
        .post<DefinedApiResponse<T>>('', { query })
        .then((res: AxiosResponse<DefinedApiResponse<T>>) => res.data.data[operationName]);
    } catch (error) {
      throw new Error(`DefinedAPI request failed: ${error}`);
    }
  }
}
