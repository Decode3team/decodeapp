import { DefinedNewToken } from '@/lib/defined/schema/defined-new-token.schema';
import { DataSummary } from './dashboard';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowRightLeft, Tag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import LiveNumber from '@/components/live-number';
import { useSearchParams } from 'next/navigation';

function TableDataNew({
  initialData,
  dataSummary,
}: Readonly<{ initialData: DefinedNewToken[]; dataSummary: (data: DataSummary) => void }>) {
  const [data, setData] = useState(initialData);
  const hasData = data && data.length > 0;
  const queryParams = useSearchParams();

  useEffect(() => {
    if (data?.length) {
      const { marketCap, volume, transaction } = (data ?? []).reduce(
        (acc, token) => {
          return {
            marketCap: acc.marketCap + parseFloat(token.marketCap),
            volume: acc.volume + parseFloat(token.volume24),
            transaction: acc.transaction + token.uniqueTransactions24,
          };
        },
        { marketCap: 0, volume: 0, transaction: 0 },
      );

      dataSummary({ marketCap, volume, transaction });
    }
  }, [initialData]);

  useEffect(() => {
    const reso = queryParams.get('resolution');
    const transactionMapping: { [key: string]: string } = {
      '60': 'uniqueTransactions1',
      '240': 'uniqueTransactions4',
      '720': 'uniqueTransactions12',
      '1D': 'uniqueTransactions24',
    };
    const volumeMapping: { [key: string]: string } = {
      '60': 'volume1',
      '240': 'volume4',
      '720': 'volume12',
      '1D': 'volume24',
    };
    const transactionKey = transactionMapping[reso ?? '1D'];
    const volKey = volumeMapping[reso ?? '1D'];

    if (transactionKey) {
      const newData = initialData.map((t) => ({
        ...t,
        uniqueTransactions24: t[transactionKey as keyof DefinedNewToken] as number,
        volume24: t[volKey as keyof DefinedNewToken] as string,
      }));

      setData(newData.toSorted((a, b) => b.uniqueTransactions24 - a.uniqueTransactions24));
    }
  }, [queryParams, initialData]);

  return (
    <div className="flex w-full rounded-md border overflow-x-auto">
      <TooltipProvider>
        <Table className="rounded-md border-border w-full table-auto">
          <TableHeader className="dark:bg-stone-950 z-50">
            <TableRow>
              <TableHead className="md:sticky md:left-0 dark:bg-stone-950">Token</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft size={12} />
                      Txn
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Transaction count</TooltipContent>
                </Tooltip>
              </TableHead>
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
            {hasData &&
              data.map((token) => (
                <TableRow key={token.token.address + token.token.name}>
                  <TableCell className="sticky left-0 dark:bg-stone-950">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-[32px] h-[32px]">
                        <AvatarImage
                          src={token.token.info.imageSmallUrl}
                          srcSet={`${token.token.info.imageLargeUrl} 2x`}
                        />
                        <AvatarFallback>
                          {token.token.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-[260px] truncate whitespace-nowrap">
                        {token.token.name}
                      </span>
                      <Badge variant="secondary">{token.token.symbol}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        $<LiveNumber num={Number(token.priceUSD)} format="0,0.000a" />
                      </TooltipTrigger>
                      <TooltipContent>
                        $
                        {Number(token.priceUSD)
                          .toFixed(12)
                          .replace(/(\.\d*?[1-9])0+$/, '$1')}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <LiveNumber num={Number(token.volume24)} format="0,0.00a" />
                  </TableCell>
                  <TableCell>
                    <LiveNumber num={Number(token.uniqueTransactions24)} format="0,0.00a" />
                  </TableCell>

                  <TableCell className="text-center">
                    <LiveNumber num={Number(token.change1)} format="0,0.00%" live sign />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={Number(token.change4)} format="0,0.00%" live sign />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={Number(token.change12)} format="0,0.00%" live sign />
                  </TableCell>
                  <TableCell className="text-center">
                    <LiveNumber num={Number(token.change24)} format="0,0.00%" live sign />
                  </TableCell>
                  <TableCell>
                    <LiveNumber num={Number(token.liquidity)} format="0,0.00a" />
                  </TableCell>
                </TableRow>
              ))}

            {!hasData && (
              <TableRow>
                <TableCell colSpan={12} className="h-15">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TooltipProvider>
    </div>
  );
}

export default TableDataNew;
