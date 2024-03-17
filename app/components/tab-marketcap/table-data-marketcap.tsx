import { useEffect } from 'react';
import { useDataSummaryStore } from '../useDataSummary';

function TableDataMarketCap({ data }) {
  const setSummaryValue = useDataSummaryStore((state) => state.setSummaryValue);

  useEffect(() => {
    if (data?.length) {
      const { marketCap, volume, transaction } = (data ?? []).reduce(
        (acc, token) => {
          return {
            marketCap: acc.marketCap + parseFloat(token.marketCap),
            volume: acc.volume + parseFloat(token.volume24),
            transaction: acc.transaction + token.uniqueTransactions24,
          };
        },
        { marketCap: 0, volume: 0, transaction: 0 },
      );

      setSummaryValue({ marketCap, volume, transaction });
    }
  }, [data]);

  return <div>Market Cap</div>;
}

export default TableDataMarketCap;
