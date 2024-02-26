import {
  RisingLiquidityTokenParams,
  TopBuyPressureTokenParams,
  ExperiencedBuyerTokenParams,
  SolidPerformanceTokenParams,
  BlueChipTokenParams,
  RiskyBetTokenParams,
  DiscoveryTokenData,
} from "./types";

type MoralisClientApiSettings = {
  moralis_api_url: string;
  moralis_api_key: string;
  httpOptions: RequestInit
}

const doFetch = async<T>(request_url: string, httpOptions: RequestInit | undefined): Promise<T> => {
  return fetch(request_url, httpOptions).then(res => res.json());
}

export class MoralisClient {
  private api_settings:MoralisClientApiSettings = {
    moralis_api_url: process.env.MORALIS_API_ENDPOINT ?? "",
    moralis_api_key: process.env.MORALIS_API_KEY ?? "",
    httpOptions: {
      headers: {
        "accept": "application/json",
        "X-API-Key": process.env.MORALIS_API_KEY ?? ""
      }
    }
  } 

  Discovery: MoralisDiscoveryApi = new MoralisDiscoveryApi(this.api_settings);
}

class MoralisDiscoveryApi {
  private discoveryApiUrlEndpoint = "/discovery/tokens";
  private discoveryApiUrl!: string;
  private settings!: MoralisClientApiSettings;

  constructor(settings: MoralisClientApiSettings) {
    this.settings = settings;
    this.discoveryApiUrl = `${settings.moralis_api_url}${this.discoveryApiUrlEndpoint}`;
  }

  async getRisingLiquidityTokens(params: RisingLiquidityTokenParams):Promise<DiscoveryTokenData[]> {
    const requestUrl = `${this.discoveryApiUrl}/rising-liquidity?chain=${params.chain}`;
    return doFetch<DiscoveryTokenData[]>(requestUrl, this.settings.httpOptions);
  }
  async getTopBuyPressureTokens(params: TopBuyPressureTokenParams):Promise<DiscoveryTokenData[]> {
    const requestUrl = `${this.discoveryApiUrl}/buying-pressure?chain=${params.chain}`;
    return doFetch<DiscoveryTokenData[]>(requestUrl, this.settings.httpOptions);
  }
  async getExperiencedBuyerTokens(params: ExperiencedBuyerTokenParams):Promise<DiscoveryTokenData[]> {
    const requestUrl = `${this.discoveryApiUrl}/experienced-buyers?chain=${params.chain}`;
    return doFetch<DiscoveryTokenData[]>(requestUrl, this.settings.httpOptions);
  }
  async getSolidPerformanceTokens(params: SolidPerformanceTokenParams):Promise<DiscoveryTokenData[]> {
    const requestUrl = `${this.discoveryApiUrl}/solid-performers?chain=${params.chain}`;
    return doFetch<DiscoveryTokenData[]>(requestUrl, this.settings.httpOptions);
  }
  async getBlueChipTokens(params: BlueChipTokenParams):Promise<DiscoveryTokenData[]> {
    const requestUrl = `${this.discoveryApiUrl}/blue-chip?chain=${params.chain}`;
    return doFetch<DiscoveryTokenData[]>(requestUrl, this.settings.httpOptions);
  }
  async getRiskyBetTokens(params: RiskyBetTokenParams):Promise<DiscoveryTokenData[]> {
    const requestUrl = `${this.discoveryApiUrl}/risky-bets?chain=${params.chain}`;
    return doFetch<DiscoveryTokenData[]>(requestUrl, this.settings.httpOptions);
  }
}
