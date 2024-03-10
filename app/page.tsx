'use client';

import { useState } from 'react';
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
  const [trendingData, setTrendingData] = useState<DefinedTopToken[]>([]);
  const [newTokenData, setNewTokenData] = useState<DefinedNewToken[]>([]);

  trpc.tokens.getTopTokens.useSubscription(
    {
      resolution: activeResolution,
      networkId,
    },
    {
      onData(data) {
        setTrendingData(data);
      },
    },
  );

  trpc.tokens.onPairMetadatUpdated.useSubscription(
    {
      tokenAddress: '0xeecb5db986c20a8c88d8332e7e252a9671565751',
      networkId: 137,
    },
    {
      onData(data) {
        console.log('DATA FROM FRONTEND', data);
      },
    },
  );

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
