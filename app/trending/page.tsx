'use client';

import { DefinedApiTimeResolution } from '@/lib/defined/types';
import Dashboard from '../components/dashboard-data-trending';
import { Suspense } from 'react';

type InitialDataType = 'trending' | 'new';

const initialTab = 'trending';

export default function Trending({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | undefined };
}>) {
  const { id, resolution, tab } = searchParams;
  const networkId = Number(id) || 1;
  const activeTab = (tab as InitialDataType) ?? initialTab;
  const activeResolution = (resolution as DefinedApiTimeResolution) ?? '1D';

  return (
    <Suspense>
      <div className="flex w-full flex-col gap-4">
        <Dashboard key={activeTab} resolution={activeResolution} networkId={networkId} />
      </div>
    </Suspense>
  );
}
