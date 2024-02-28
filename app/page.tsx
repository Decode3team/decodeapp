import { serverClient } from './_trpc/server-client';
import Dashboard from './components/dashboard';

export default async function Home() {
  const data = await serverClient['top-tokens']({ resolution: '1D' });

  return <Dashboard initialData={data} />;
}
