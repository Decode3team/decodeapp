import { Card } from '@/components/ui/card';
import { serverClient } from './_trpc/server-client';
import Dashboard from './components/dashboard';

export default async function Home() {
  const data = await serverClient['top-tokens']({ resolution: '1D' });

  return (
    <div className="flex w-full flex-col gap-4">
      <Card>
        <div className="p-4">Smog Token Next 100x SOL Meme Coin? Claim the FREE Airdrop!</div>
      </Card>
      <Dashboard initialData={data} />
    </div>
  );
}
