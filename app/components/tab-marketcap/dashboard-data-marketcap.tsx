'use client';

import { DefinedApiTimeResolution } from '@/lib/defined/types';
import DashboardSummary from '../dashboard-summary';
import { Separator } from '@/components/ui/separator';
import DashboadControl from '../dashboard-controls';
import TableDataMarketCap from './table-data-marketcap';
import { trpc } from '@/lib/utils/trpc';

function DashboardDataMarketCap({
  resolution,
  networkId,
}: Readonly<{
  resolution: DefinedApiTimeResolution;
  networkId: number;
}>) {
  const { data, fetchNextPage } = trpc.tokens.getTokensByMarketCap.useInfiniteQuery(
    {
      networkId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      refetchInterval: 2 * 60 * 1000, // 2 mins
    },
  );

  console.log(data);

  return (
    <div className="flex w-full flex-col">
      <DashboardSummary />
      <Separator className="mt-2" />
      <DashboadControl resolution={resolution} />
      <TableDataMarketCap />
    </div>
  );
}

export default DashboardDataMarketCap;
