'use client';

import { ArrowRightLeft, BarChart, Filter, Flame, Leaf, PieChart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import numeral from 'numeral';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { DefinedApiTimeResolution, DefinedTopTokenModel } from '@/lib/defined/types';
import { trpc } from '../_trpc/client';
import { Skeleton } from '@/components/ui/skeleton';
import LiveNumber from '@/components/live-number';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const format = (num: number, format = '0.0.00a') => {
  const threshold = 1e-6;
  const val = isFinite(num) && Math.abs(num) >= threshold ? num : 0;

  return numeral(val).format(format).toUpperCase();
};

function Dashboard({ initialData }: Readonly<{ initialData: DefinedTopTokenModel[] }>) {
  const [resolution, setResolution] = useState<DefinedApiTimeResolution>('1D');
  const { data, isFetching } = trpc['top-tokens'].useQuery(
    {
      resolution,
    },
    {
      initialData,
    },
  );

  const { marketCap, volume, transaction } = data.reduce(
    (acc, token) => {
      return {
        marketCap: acc.marketCap + parseFloat(token.marketCap),
        volume: acc.volume + parseFloat(token.volume),
        transaction: acc.transaction + token.txnCount24,
      };
    },
    { marketCap: 0, volume: 0, transaction: 0 },
  );

  return (
    <div className="flex w-full flex-col">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <BarChart />
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <Skeleton className="w-[150px] h-[32px] rounded-md" />
            ) : (
              <LiveNumber className="text-2xl font-bold" num={marketCap} />
            )}

            {/* <Badge className="bg-red-600 hover:bg-red-600">-0.34%</Badge> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24 hour volume</CardTitle>
            <PieChart />
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <Skeleton className="w-[150px] h-[32px] rounded-md" />
            ) : (
              <LiveNumber className="text-2xl font-bold" num={volume} />
            )}

            {/* <Badge className="bg-green-600 hover:bg-green-600">+1.07%</Badge> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Transaction</CardTitle>
            <ArrowRightLeft />
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <Skeleton className="w-[150px] h-[32px] rounded-md" />
            ) : (
              <LiveNumber className="text-2xl font-bold" num={transaction} />
            )}

            {/* <Badge className="bg-green-600 hover:bg-green-600">+0.22%</Badge> */}
          </CardContent>
        </Card>
      </div>

      <div className="sticky top-0 py-4 flex flex-wrap w-full dark:bg-stone-950 z-50">
        <Tabs defaultValue={resolution} className="space-y-4 mr-2">
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
          <Button>
            <BarChart className="mr-2 h-4 w-4" />
            Market Cap
          </Button>
          <Button variant="ghost">
            <Flame className="mr-2 h-4 w-4" />
            Trending
          </Button>
          <Button variant="ghost">
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

      {/* <ScrollArea className="overflow-x-auto whitespace-nowrap"> */}
      <div className="flex w-full rounded-md border overflow-x-auto">
        <TooltipProvider>
          <Table className="rounded-md border-border w-full table-auto">
            <TableHeader className="dark:bg-stone-950 z-50">
              <TableRow>
                <TableHead className="sticky left-0 dark:bg-stone-950">Token</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft size={12} />
                        1h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>1 hour transaction count</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft size={12} />
                        4h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>4 hour transaction count</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft size={12} />
                        12h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>12 hour transaction count</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft size={12} />
                        24h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>24 hour transaction count</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead>Volume</TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <Tag size={12} />
                        1h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>1 hour price change</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <Tag size={12} />
                        4h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>4 hour price change</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <Tag size={12} />
                        12h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>12 hour price change</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <Tag size={12} />
                        24h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>24 hour price change</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead>Liquidity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((token) => (
                <TableRow key={token.address + token.name}>
                  <TableCell className="sticky left-0 dark:bg-stone-950">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-[32px] h-[32px]">
                        <AvatarImage
                          src={token.imageSmallUrl}
                          srcSet={`${token.imageLargeUrl} 2x`}
                        />
                        <AvatarFallback>{token.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {token.name}
                      <Badge variant="secondary">{token.symbol}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>${format(token.price, '0,0.00000a')}</TableCell>

                  <TableCell className="text-center">
                    <LiveNumber num={token.txnCount1} format="0,0" />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={token.txnCount4} format="0,0" />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={token.txnCount12} format="0,0" />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={token.txnCount24} format="0,0" />
                  </TableCell>

                  <TableCell>{format(parseFloat(token.volume))}</TableCell>

                  <TableCell className="text-center">
                    <LiveNumber num={token.priceChange1} format="0,0.00000a" live sign />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={token.priceChange4} format="0,0.00000a" live sign />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={token.priceChange12} format="0,0.00000a" live sign />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={token.priceChange24} format="0,0.00000a" live sign />
                  </TableCell>
                  <TableCell>{format(parseFloat(token.liquidity))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
      {/* <ScrollBar orientation="horizontal" />
      </ScrollArea> */}
    </div>
  );
}

export default Dashboard;
