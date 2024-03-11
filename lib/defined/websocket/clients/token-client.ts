import ZenObservable from 'zen-observable';
import { DefinedOnPairMetadataUpdated } from '../../schema/websocket/defined-onpairmetadataupdated-schema';
import { PairId } from '../../types';
import { DefinedWebsocketApiClient } from '../client';
import { DefinedOnPriceUpdate } from '../../schema/websocket/defined-on-price-updated.schema';

export class DefinedWebsocketApiTokenClient {
  private client!: DefinedWebsocketApiClient;

  constructor(client: DefinedWebsocketApiClient) {
    this.client = client;
  }

  public onPairMetadataUpdated(
    tokenAddress: string,
    networkId: number,
  ): ZenObservable<DefinedOnPairMetadataUpdated> {
    const operationName = 'onPairMetadataUpdated';
    const pairId: PairId = `${tokenAddress}:${networkId}`;

    const observer = this.client.createObservable<DefinedOnPairMetadataUpdated>(operationName, {
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
    });

    return observer;
  }

  public onPriceUpdated(tokenAddress: string, networkId: number) {
    const operationName = 'onPriceUpdated';

    return this.client.createObservable<DefinedOnPriceUpdate>(operationName, {
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
    });
  }
}
