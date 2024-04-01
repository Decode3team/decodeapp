import { Metadata } from 'next';
import TabHandler from './components/tab-handler';

export const metadata: Metadata = {
  title: 'Token Analytics',
};

export default function TokenAnalytics({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | undefined };
}>) {
  const { tab } = searchParams;

  return (
    <div className="py-4 flex flex-wrap w-full dark:bg-stone-950 z-50 gap-2">
      <TabHandler defaultTab={tab} />
    </div>
  );
}
