'use client';

import DashboardSummary from './dashboard-summary';
import DashboadControl from './dashboard-controls';
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
  const { data, fetchNextPage } = trpc.tokens.getNewTokes.useInfiniteQuery(
    {
      networkId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
      refetchInterval: 2 * 60 * 1000, // 2 mins
    },
  );

  return (
    <div className="flex w-full flex-col">
      <DashboardSummary />
      <Separator className="mt-2" />
      <DashboadControl resolution={resolution} />
      <TableDataNew
        data={data?.pages.flatMap((page) => page.items) ?? []}
        onPageEnd={fetchNextPage}
      />
    </div>
  );
}

export default DashboardDataNew;
