import { DefinedOnPairMetadataUpdated } from '../../schema/websocket/defined-onpairmetadataupdated-schema';
import { PairId, WebsocketSink } from '../../types';
import { DefinedWebsocketApiClient } from '../client';
import { DefinedOnPriceUpdate } from '../../schema/websocket/defined-on-price-updated.schema';

export class DefinedWebsocketApiTokenClient {
  public client!: DefinedWebsocketApiClient;

  constructor(client: DefinedWebsocketApiClient = new DefinedWebsocketApiClient()) {
    this.client = client;
  }

  public onPairMetadataUpdated(pairId: PairId, sink: WebsocketSink<DefinedOnPairMetadataUpdated>) {
    const operationName = 'onPairMetadataUpdated';

    return this.client.subscribe<DefinedOnPairMetadataUpdated>(
      operationName,
      {
        query: `subscription OnPairMetadataUpdated($id: String) {
                ${operationName}(id: $id) {
                    id
                    exchangeId
                    pairAddress
                    liquidity
                    liquidityToken
                    nonLiquidityToken
                    quoteToken
                    statsType
                    priceChange1
                    priceChange4
                    priceChange12
                    priceChange24
                    volume1
                    volume4
                    volume12
                    volume24
                    price
                    token0 {
                        address
                        decimals
                        name
                        networkId
                        pooled
                        price
                        symbol
                    }
                    token1 {
                        address
                        decimals
                        name
                        networkId
                        pooled
                        price
                        symbol
                    }
                }
            }`,
        variables: {
          id: pairId,
        },
      },
      sink,
    );
  }

  public onPriceUpdated(
    tokenAddress: string,
    networkId: number,
    sink: WebsocketSink<DefinedOnPriceUpdate>,
  ) {
    const operationName = 'onPriceUpdated';

    return this.client.subscribe<DefinedOnPriceUpdate>(
      operationName,
      {
        query: `subscription OnPriceUpdated($tokenAddress: String, $networkId: Int) {
          ${operationName}(address: $tokenAddress, networkId: $networkId) {
            priceUsd
            timestamp
          }
        }
      `,
        variables: {
          tokenAddress,
          networkId,
        },
      },
      sink,
    );
  }
}
