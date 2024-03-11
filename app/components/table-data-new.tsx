import { DefinedNewToken } from '@/lib/defined/schema/defined-new-token.schema';
import { useEffect } from 'react';
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
import { DataSummary } from './dashboard-summary';
import TableDataNewRow from './table-data-new-row';

function TableDataNew({
  data,
  onDataSummary,
}: Readonly<{ data: DefinedNewToken[]; onDataSummary: (data: DataSummary) => void }>) {
  const hasData = data.length > 0;

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

      onDataSummary({ marketCap, volume, transaction });
    }
  }, [data]);

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
            {hasData && data.map((token) => <TableDataNewRow key={token.token.id} token={token} />)}
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
