'use client';

import TableDataTrending from './table-data-trending';
import DashboardSummary, { DataSummary } from './dashboard-summary';
import DashboadControl from './dashboard-controls';
import { useState } from 'react';
import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { Separator } from '@/components/ui/separator';
import { DefinedTopToken } from '@/lib/defined/schema/defined-top-token.schema';
import { trpc } from '@/lib/utils/trpc';

function DashboardDataTrending({
  resolution,
  networkId,
}: Readonly<{
  resolution: DefinedApiTimeResolution;
  networkId: number;
}>) {
  const [dataSummary, setDataSummary] = useState({ marketCap: 0, volume: 0, transaction: 0 });
  const [trendingData, setTrendingData] = useState<DefinedTopToken[]>([]);

  trpc.tokens.getTopTokens.useSubscription(
    {
      resolution,
      networkId,
    },
    {
      onData(data) {
        setTrendingData(data);
      },
    },
  );

  const handleDataSummaryChange = (data: DataSummary) => {
    setDataSummary({
      marketCap: data.marketCap,
      volume: data.volume,
      transaction: data.transaction,
    });
  };

  return (
    <div className="flex w-full flex-col">
      <DashboardSummary dataSummary={dataSummary} />
      <Separator className="mt-2" />
      <DashboadControl resolution={resolution} />
      <TableDataTrending onDataSummary={handleDataSummaryChange} data={trendingData} />
    </div>
  );
}

export default DashboardDataTrending;
