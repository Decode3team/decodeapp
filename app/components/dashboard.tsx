'use client';

import { BarChart, Filter, Flame, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { DefinedApiTimeResolution, DefinedTopTokenModel } from '@/lib/defined/types';
import LiveNumber from '@/components/live-number';
import { Separator } from '@/components/ui/separator';
import TableDataTrending from './table-data-trending';

export type DataSummary = {
  marketCap: number;
  volume: number;
  transaction: number;
};

function Dashboard({ initialData }: Readonly<{ initialData: DefinedTopTokenModel[] }>) {
  const [resolution, setResolution] = useState<DefinedApiTimeResolution>('1D');
  const [dataSummary, setDataSummary] = useState({ marketCap: 0, volume: 0, transaction: 0 });
  const [activeTab, setActiveTab] = useState('trending');

  const handleDataSummaryChange = (data: DataSummary) => {
    setDataSummary({
      marketCap: data.marketCap,
      volume: data.volume,
      transaction: data.transaction,
    });
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row gap-3">
        <div className="text-sm">
          Market Cap:{' '}
          <span className="dark:text-lime-700">
            $<LiveNumber num={dataSummary.marketCap} format="0,0.00a" />
          </span>
        </div>
        <div className="text-sm">
          24h Vol:{' '}
          <span className="dark:text-lime-700">
            $<LiveNumber num={dataSummary.volume} format="0,0.00a" />
          </span>
        </div>
        <div className="text-sm">
          24h Transactions:{' '}
          <LiveNumber
            num={dataSummary.transaction}
            format="0,0.00a"
            className="dark:text-lime-700"
          />
        </div>
      </div>
      <Separator className="mt-2" />

      <div className="sticky top-0 py-4 flex flex-wrap w-full dark:bg-stone-950 z-50 gap-2">
        <Tabs defaultValue={resolution} className="space-y-4">
          <TabsList>
            <TabsTrigger value="5" onClick={() => setResolution('60')}>
              1H
            </TabsTrigger>
            <TabsTrigger value="60" onClick={() => setResolution('240')}>
              4H
            </TabsTrigger>
            <TabsTrigger value="720" onClick={() => setResolution('720')}>
              12H
            </TabsTrigger>
            <TabsTrigger value="1D" onClick={() => setResolution('1D')}>
              24H
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <nav className={cn('flex items-center space-x-2')}>
          <Button
            variant={activeTab === 'marketcap' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('marketcap')}>
            <BarChart className="mr-2 h-4 w-4" />
            Market Cap
          </Button>
          <Button
            variant={activeTab === 'trending' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('trending')}>
            <Flame className="mr-2 h-4 w-4" />
            Trending
          </Button>
          <Button
            variant={activeTab === 'new' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('new')}>
            <Leaf className="mr-2 h-4 w-4" />
            New
          </Button>
          <Sheet>
            <Button variant="outline" asChild>
              <SheetTrigger>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </SheetTrigger>
            </Button>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Filter goes here</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </nav>
      </div>

      {activeTab === 'trending' && (
        <TableDataTrending resolution={resolution} dataSummary={handleDataSummaryChange} />
      )}
    </div>
  );
}

export default Dashboard;
