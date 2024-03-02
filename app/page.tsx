import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { serverClient } from './_trpc/server-client';
import Dashboard from './components/dashboard';
import { DefinedTopToken } from '@/lib/defined/schema/defined-top-token.schema';
import { DefinedNewToken } from '@/lib/defined/schema/defined-new-token.schema';

type InitialDataType = 'trending' | 'new';

const initialTab = 'trending';

export default async function Home({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | undefined };
}>) {
  const { id, resolution, tab } = searchParams;
  const networkId = Number(id) || 0;
  const activeTab = (tab as InitialDataType) ?? initialTab;
  const activeResolution = (resolution as DefinedApiTimeResolution) ?? '1D';

  let trendingData: DefinedTopToken[] = [];
  let newTokenData: DefinedNewToken[] = [];

  const intialData = {
    trending: async () => {
      trendingData = await serverClient['top-tokens']({
        resolution: activeResolution,
        networkId,
      });
    },
    new: async () => {
      newTokenData = await serverClient['new-tokens']({
        networkId,
      });
    },
  };

  intialData[activeTab] && (await intialData[activeTab]());

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
