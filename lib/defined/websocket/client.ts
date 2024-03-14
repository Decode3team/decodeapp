import { createClient, Client, SubscribePayload } from 'graphql-ws';
import { DefinedApiResponse } from '../types';
import ws from 'ws';
import ZenObservable from 'zen-observable';

class DefinedWebsocketApiClient {
  private static instance: DefinedWebsocketApiClient;
  private client!: Client;

  private constructor() {
    this.client = createClient({
      webSocketImpl: ws,
      url: process.env.DEFINED_WEBSOCKET_API_URL ?? '',
      retryAttempts: 10,
      retryWait: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 3000));
      },
      connectionParams: {
        Authorization: process.env.DEFINED_WEBSOCKET_API_KEY ?? '',
      },
    });

    this.client.on('connecting', () => {
      console.log('[Connecting] to the Defined Websocket...');
    });

    this.client.on('connected', () => {
      console.log('[Connected] to the Defined Websocket');
    });

    this.client.on('error', (err) => {
      console.log('[Error] in the Defined Websocket', err);
    });
  }

  /**
   * Returns an instance of DefinedWebsocketClient if it exists, otherwise creates and returns a new instance.
   *
   * @return {DefinedWebsocketApiClient} The instance of DefinedWebsocketClient
   */
  public static getInstance(): DefinedWebsocketApiClient {
    if (!DefinedWebsocketApiClient.instance) {
      DefinedWebsocketApiClient.instance = new DefinedWebsocketApiClient();
    }

    return DefinedWebsocketApiClient.instance;
  }

  /**
   * Get the client.
   *
   * @return {Client} the client
   */
  public getClient(): Client {
    return this.client;
  }

  /**
   * Observe a Defined API subscription endpoint
   *
   * @param {string} operationName - the name of the operation
   * @param {SubscribePayload} payload - the payload for the subscription
   * @return {ZenObservable<T>} - observable object with the subscrition events
   */
  public createObservable<T>(operationName: string, payload: SubscribePayload): ZenObservable<T> {
    return new ZenObservable<T>((observer) => {
      console.log(`Subscribing to ${operationName}:`, payload);
      this.client.subscribe<DefinedApiResponse<T>>(payload, {
        next: (data) => observer.next(data?.data?.[operationName] ?? ({} as T)),
        error: observer.error,
        complete: observer.complete,
      });
    });
  }
}

export { DefinedWebsocketApiClient };
