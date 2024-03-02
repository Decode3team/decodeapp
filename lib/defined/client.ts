import { DefinedApiResponse } from '@/lib/defined/types';
import { GraphQLClient, gql as GqlTag } from 'graphql-request';

class DefinedApiClient {
  private static instance: DefinedApiClient;
  private client: GraphQLClient;

  private constructor() {
    this.client = new GraphQLClient(process.env.DEFINED_API_URL ?? '', {
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

  async query<T>(
    operationName: string,
    query: string,
    variables?: Record<string, any>,
  ): Promise<T> {
    try {
      return this.client.request<DefinedApiResponse<T>>(query, variables).then((res) => {
        return res[operationName];
      });
    } catch (error) {
      throw new Error(`GraphQL query failed: ${error}`);
    }
  }
}

export { GqlTag, DefinedApiClient };
