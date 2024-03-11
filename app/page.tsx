import { DefinedApiTimeResolution } from '@/lib/defined/types';
import DashboardDataTrending from './components/dashboard-data-trending';
import DashboardDataNew from './components/dashboard-data-new';

type InitialDataType = 'trending' | 'new';

export default function Home({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | undefined };
}>) {
  const { id, resolution, tab } = searchParams;
  const networkId = Number(id) || 1;
  const activeTab = (tab as InitialDataType) ?? 'trending';
  const activeResolution = (resolution as DefinedApiTimeResolution) ?? '1D';

  return (
    <div className="flex w-full flex-col gap-4">
      {activeTab === 'trending' && (
        <DashboardDataTrending resolution={activeResolution} networkId={networkId} />
      )}

      {activeTab === 'new' && (
        <DashboardDataNew resolution={activeResolution} networkId={networkId} />
      )}
    </div>
  );
}
