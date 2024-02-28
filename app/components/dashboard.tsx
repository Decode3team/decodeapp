'use client';

import { ArrowRightLeft, BarChart, Filter, Flame, Leaf, PieChart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query';
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
import { useEffect, useState } from 'react';
import { DefinedApiTimeResolution, DefinedTopTokenModel } from '@/lib/defined/types';
import { trpc } from '../_trpc/client';

const format = (num: number, format = '0.0.00a') => {
  const threshold = 1e-6;
  const val = isFinite(num) && Math.abs(num) >= threshold ? num : 0;

  return numeral(val).format(format).toUpperCase();
};

function Dashboard({ initialData }: Readonly<{ initialData: DefinedTopTokenModel[] }>) {
  const [resolution, setResolution] = useState<DefinedApiTimeResolution>('1D');
  const utils = trpc.useUtils();
  const { data } = trpc['top-tokens'].useQuery(
    {
      resolution,
    },
    {
      // suspense: true,
      // enabled: false,
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

  // useEffect(() => {
  //   if (resolution) {
  //     fetchData();
  //   }
  // }, [resolution]);

  return (
    <div className="flex w-full flex-col gap-4">
      <Card>
        <div className="p-4">Smog Token Next 100x SOL Meme Coin? Claim the FREE Airdrop!</div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <BarChart />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${format(marketCap)}</div>
            {/* <Badge className="bg-red-600 hover:bg-red-600">-0.34%</Badge> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24 hour volume</CardTitle>
            <PieChart />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${format(volume)}</div>
            {/* <Badge className="bg-green-600 hover:bg-green-600">+1.07%</Badge> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Transaction</CardTitle>
            <ArrowRightLeft />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${format(transaction)}</div>
            {/* <Badge className="bg-green-600 hover:bg-green-600">+0.22%</Badge> */}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap max-w-screen-lg">
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

      <div className="rounded-md border">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
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
                  {token.address === '0x3419875b4d3bca7f3fdda2db7a476a79fd31b4feDizzyHavoc' &&
                    console.log(token.name)}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-[32px] h-[32px]">
                        <AvatarImage
                          src={token.imageSmallUrl}
                          srcSet={`${token.imageLargeUrl} 2x`}
                        />
                        <AvatarFallback>{token.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {token.name}
                      <Badge variant="outline">{token.symbol}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>${format(token.price, '0,0.00000a')}</TableCell>
                  <TableCell className="text-center">{format(token.txnCount1, '0,0')}</TableCell>
                  <TableCell className="text-center">{format(token.txnCount4, '0,0')}</TableCell>
                  <TableCell className="text-center">{format(token.txnCount12, '0,0')}</TableCell>
                  <TableCell className="text-center">{format(token.txnCount24, '0,0')}</TableCell>
                  <TableCell>{format(parseFloat(token.volume))}</TableCell>
                  <TableCell className="text-center">{format(token.priceChange1)}</TableCell>
                  <TableCell className="text-center">{format(token.priceChange4)}</TableCell>
                  <TableCell className="text-center">{format(token.priceChange12)}</TableCell>
                  <TableCell className="text-center">{format(token.priceChange24)}</TableCell>
                  <TableCell>{format(parseFloat(token.liquidity))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default Dashboard;