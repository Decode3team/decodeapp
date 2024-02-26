import { 
    RisingLiquidityTokenParams,
    TopBuyPressureTokenParams,
    ExperiencedBuyerTokenParams,
    SolidPerformanceTokenParams,
    BlueChipTokenParams,
    RiskyBetTokenParams
} from "./types"

export class MoralisClient {
    Discovery: MoralisDiscoveryApi = new MoralisDiscoveryApi
}

class MoralisDiscoveryApi {
    async getRisingLiquidityTokens(params: RisingLiquidityTokenParams) {
        const requestUrl = "https://deep-index.moralis.io/api/v2.2/discovery/tokens/rising-liquidity?chain=eth&one_month_liquidity_change_usd=500000&min_market_cap=100000000&twitter_followers=10000&one_month_volume_change_usd=10000&security_score=70&one_month_price_percent_change_usd=0'";
        const data = await fetch(requestUrl, {
            headers: {
                'accept': 'application/json',
                'X-API-Key': process.env.MORALIS_API_KEY
            }
        });

        return await data.json();
    }
    async getTopBuyPressureTokens(params: TopBuyPressureTokenParams) {}
    async getExperiencedBuyerTokens(params: ExperiencedBuyerTokenParams) {}
    async getSolidPerformanceTokens(params: SolidPerformanceTokenParams)  {}
    async getBlueChipTokens(params: BlueChipTokenParams) {}
    async getRiskyBetTokens(params: RiskyBetTokenParams) {}
}