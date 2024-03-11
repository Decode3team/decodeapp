import LiveNumber from '@/components/live-number';

export type DataSummary = {
  marketCap: number;
  volume: number;
  transaction: number;
};

function DashboardSummary({ dataSummary }: { dataSummary: DataSummary }) {
  return (
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
        <LiveNumber num={dataSummary.transaction} format="0,0.00a" className="dark:text-lime-700" />
      </div>
    </div>
  );
}

export default DashboardSummary;
