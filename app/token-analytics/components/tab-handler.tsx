'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTabState from './useTabState';
import TabOverview from './tab-overview';

export const TAB_IDS = {
  overview: 'overview',
  priceChart: 'price-chart',
  security: 'security',
  bubbleChart: 'bubble-chart',
  about: 'about',
};

export default function TabHandler({
  defaultTab,
}: Readonly<{
  defaultTab?: string;
}>) {
  const { defaultValue, tabChangeHandler } = useTabState(defaultTab);

  return (
    <div className="py-4 flex flex-wrap w-full dark:bg-stone-950 z-50 gap-2">
      <Tabs defaultValue={defaultValue} value={defaultValue} className="w-full">
        <TabsList className="mb-10">
          <TabsTrigger value={TAB_IDS.overview} onClick={() => tabChangeHandler('overview')}>
            Overview
          </TabsTrigger>
          <TabsTrigger value={TAB_IDS.priceChart} onClick={() => tabChangeHandler('price-chart')}>
            Price Chart
          </TabsTrigger>
          <TabsTrigger value={TAB_IDS.security} onClick={() => tabChangeHandler('security')}>
            Security
          </TabsTrigger>
          <TabsTrigger value={TAB_IDS.bubbleChart} onClick={() => tabChangeHandler('bubble-chart')}>
            Bubble Chart
          </TabsTrigger>
          <TabsTrigger value={TAB_IDS.about} onClick={() => tabChangeHandler('about')}>
            About
          </TabsTrigger>
        </TabsList>
        <TabsContent value={TAB_IDS.overview} className="m-0">
          <TabOverview />
        </TabsContent>
        <TabsContent value={TAB_IDS.priceChart} className="m-0">
          <div>price-chart</div>
        </TabsContent>
        <TabsContent value={TAB_IDS.security}>
          <div>security</div>
        </TabsContent>
        <TabsContent value={TAB_IDS.bubbleChart} className="m-0">
          <div>bubble-chart</div>
        </TabsContent>
        <TabsContent value={TAB_IDS.about} className="m-0">
          <div>about</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
