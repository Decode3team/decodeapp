'use client';

import { DefinedApiTimeResolution } from '@/lib/defined/types';
import Dashboard from './components/dashboard';
import { DefinedTopToken } from '@/lib/defined/schema/defined-top-token.schema';
import { DefinedNewToken } from '@/lib/defined/schema/defined-new-token.schema';
import { trpc } from '@/lib/utils/trpc';

type InitialDataType = 'trending' | 'new';

const initialTab = 'trending';

export default function Home({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | undefined };
}>) {
  const { id, resolution, tab } = searchParams;
  const networkId = Number(id) || 1;
  const activeTab = (tab as InitialDataType) ?? initialTab;
  const activeResolution = (resolution as DefinedApiTimeResolution) ?? '1D';

  let trendingData: DefinedTopToken[] = [];
  let newTokenData: DefinedNewToken[] = [];

  const intialData = {
    trending: () => {
      trendingData = trpc.tokens.getTopTokens.useQuery({ 
        resolution: activeResolution,
        networkId 
      }).data ?? []
    },
    new: () => {
      newTokenData = trpc.tokens.getNewTokens.useQuery({  networkId }).data ?? [];
    },
  };

  intialData[activeTab] && intialData[activeTab]();

  return (
    <div className="flex w-full flex-col gap-4">
      <Dashboard
        key={activeTab}
        resolution={activeResolution}
        initialTab={activeTab}
        trendingData={trendingData}
        newTokenData={newTokenData}
      />
    </div>
  );
}
