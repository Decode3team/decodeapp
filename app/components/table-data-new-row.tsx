import LiveNumber from '@/components/live-number';
import { DefinedNewToken } from '@/lib/defined/schema/defined-new-token.schema';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/utils/trpc';
import { useEffect, useState } from 'react';

function TableDataNewRow({ initialData }: { initialData: DefinedNewToken }) {
  const [token, setToken] = useState<DefinedNewToken>(initialData);
  const [updated, setUpdated] = useState(false);

  trpc.tokens.onPriceUpdated.useSubscription(
    {
      tokenAddress: token.token.address,
      networkId: token.token.networkId,
    },
    {
      onData(data) {
        console.log('DATA FROM FRONTEND', data);
        setToken({
          ...token,
          priceUSD: data.priceUsd,
        });
        setUpdated(true);
      },
    },
  );

  useEffect(() => {
    if (updated) {
      const timer = setTimeout(() => {
        setUpdated(false);
      }, 3000); // Reset updated to false after 3 seconds

      // Cleanup function to clear the timer
      return () => clearTimeout(timer);
    }
  }, [updated]);

  return (
    <TableRow
      key={token.token.id}
      className={`${updated ? 'dark:bg-stone-800' : 'dark:bg-stone-950'} transition-colors duration-300`}>
      <TableCell className="sticky left-0 dark:bg-stone-950">
        <div className="flex items-center gap-2">
          <Avatar className="w-[32px] h-[32px]">
            <AvatarImage
              src={token.token.info.imageSmallUrl ?? ''}
              srcSet={`${token.token.info.imageLargeUrl} 2x`}
            />
            <AvatarFallback>{token.token.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="max-w-[260px] truncate whitespace-nowrap">{token.token.name}</span>
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
  );
}

export default TableDataNewRow;
