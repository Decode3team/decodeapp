import { ArrowRightLeft, BarChart, Filter, Flame, Leaf, PieChart } from 'lucide-react';
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

export default async function Home() {
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
            <div className="text-2xl font-bold">$1.98T</div>
            {/* <Badge className="bg-red-600 hover:bg-red-600">-0.34%</Badge> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24 hour volume</CardTitle>
            <PieChart />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6.19B</div>
            {/* <Badge className="bg-green-600 hover:bg-green-600">+1.07%</Badge> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Transaction</CardTitle>
            <ArrowRightLeft />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$6,332,086</div>
            {/* <Badge className="bg-green-600 hover:bg-green-600">+0.22%</Badge> */}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap max-w-screen-lg">
        <Tabs defaultValue="overview" className="space-y-4 mr-2">
          <TabsList>
            <TabsTrigger value="overview">5M</TabsTrigger>
            <TabsTrigger value="analytics">1H</TabsTrigger>
            <TabsTrigger value="reports">6H</TabsTrigger>
            <TabsTrigger value="notifications">24H</TabsTrigger>
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
    </div>
  );
}
