import { DefinedApiTimeResolution } from '@/lib/defined/types';
import { serverClient } from './_trpc/server-client';
import Dashboard from './components/dashboard';

export default async function Home({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const { id, resolution } = searchParams;
  const networkId = Number(id) || 0;
  const activeResolution = (resolution as DefinedApiTimeResolution) ?? '1D';
  const data = await serverClient['top-tokens']({
    resolution: activeResolution,
    networkId,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <Dashboard initialData={data} resolution={activeResolution} />
    </div>
  );
}
