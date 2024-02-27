import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DefinedApiResponse } from '@/lib/defined/types';

export class DefinedApiClient {
  private client!: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.DEFINED_API_URL ?? '',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.DEFINED_API_KEY ?? '',
      },
    });
  }

  async query<T>(operationName: string, query: string): Promise<T> {
    try {
      return this.client
        .post<DefinedApiResponse<T>>('', { query })
        .then((res: AxiosResponse<DefinedApiResponse<T>>) => res.data.data[operationName]);
    } catch (error: any) {
      throw new Error(`DefinedAPI request failed: ${error.message}`);
    }
  }
}
