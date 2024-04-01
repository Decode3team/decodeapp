import LiveNumber from '@/components/live-number';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { ArrowDownToLine, ArrowUpToLine, Bell, Copy, Heart, Shield, Star } from 'lucide-react';

function TabOverview() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid md:grid-cols-2 w-full gap-4">
        <div>
          <div className="flex gap-4">
            <Avatar className="w-[48px] h-[48px]">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Filecoing</h2>
              <span className="text-sm">FIL</span>
            </div>
          </div>
          <div className="flex flex-row items-center gap-2 mt-4">
            <h1 className="text-3xl font-bold">$7.47</h1>
            <LiveNumber num={3.2} live sign format="0,0.00%" />
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          <Button>
            <ArrowDownToLine className="w-[14px] h-[14px] mr-2" />
            Button
          </Button>
          <Button variant="destructive">
            <ArrowUpToLine className="w-[14px] h-[14px] mr-2" />
            Sell
          </Button>
          <Button variant="secondary">
            <Heart className="w-[14px] h-[14px] mr-2" />
            Save
          </Button>
          <Button variant="secondary">
            <Bell className="w-[14px] h-[14px] mr-2" />
            Create
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 w-full gap-4">
        <div>
          <Table>
            <TableRow>
              <TableHead className="pl-0">Token Age</TableHead>
              <TableCell>3 years</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">Chain</TableHead>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-[16px] h-[16px]">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="max-w-[260px] truncate whitespace-nowrap">Ethereum</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">Market Cap</TableHead>
              <TableCell>$3,835,110,139</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">Fully Diluted Valuation</TableHead>
              <TableCell>$14,702,073,950</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">24 Hour Trading Vol:</TableHead>
              <TableCell>$1,364,452,639</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">Circulating Supply:</TableHead>
              <TableCell>$14,702,073,950</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">Total Supply:</TableHead>
              <TableCell>1,960,909,581</TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">Security Score:</TableHead>
              <TableCell>
                <div className="flex flex-row items-center gap-1">
                  <Shield size={14} />
                  60
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">Rating:</TableHead>
              <TableCell>
                <div className="flex flex-row items-center gap-1">
                  <Star size={14} />
                  2.9 (2 ratings)
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="pl-0">Coin Address:</TableHead>
              <TableCell>
                <div className="flex flex-row items-center gap-1">
                  0x47d2...0a6c97
                  <Button variant="link" size="icon">
                    <Copy className="w-[14px] h-[14px]" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </Table>
        </div>
        <div>Shortcuts</div>
      </div>
    </div>
  );
}

export default TabOverview;
