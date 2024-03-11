'use client';

import DashboardSummary, { DataSummary } from './dashboard-summary';
import DashboadControl from './dashboard-controls';
import { useState } from 'react';
import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/utils/trpc';
import TableDataNew from './table-data-new';

function DashboardDataNew({
  resolution,
  networkId,
}: Readonly<{
  resolution: DefinedApiTimeResolution;
  networkId: number;
}>) {
  const [dataSummary, setDataSummary] = useState({ marketCap: 0, volume: 0, transaction: 0 });

  const { data } = trpc.tokens.getNewTokes.useQuery({
    networkId,
    resolution,
  });

  // trpc.tokens.onPairMetadatUpdated.useSubscription(
  //   {
  //     tokenAddress: '0xeecb5db986c20a8c88d8332e7e252a9671565751',
  //     networkId: 137,
  //   },
  //   {
  //     onData(data) {
  //       setData([]);
  //       console.log('DATA FROM FRONTEND', data);
  //     },
  //   },
  // );

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
      <TableDataNew onDataSummary={handleDataSummaryChange} data={data ?? []} />
    </div>
  );
}

export default DashboardDataNew;
