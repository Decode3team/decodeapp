// TradingViewWidget.jsx
import { redirect, useSearchParams } from 'next/navigation';
import React, { memo } from 'react';

type UrlConfig = {
  protocol: string;
  host: string;
  path: string;
  queryParams: {
    [key: string]: string;
  };
};

function TradingViewWidget() {
  const searchParams = useSearchParams();
  const network = searchParams.get('network');
  const address = searchParams.get('address');

  if (!network || !address) redirect(`/`);

  const urlConfig = {
    protocol: 'https',
    host: 'www.defined.fi',
    path: `/${network}/${address}`,
    queryParams: {
      quoteToken: 'token1',
      embedded: '1',
      hideTxTable: '0',
      hideSidebar: '0',
      embedColorMode: 'DARK',
    },
  };
  const constructUrl = (config: UrlConfig) => {
    const queryParams = Object.entries(config.queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return `${config.protocol}://${config.host}${config.path}?${queryParams}`;
  };

  const fullUrl = constructUrl(urlConfig);

  return (
    <div className="grow h-full" id="hello">
      <iframe
        className="h-full w-full dark:bg-stone-950"
        id="defined-embed"
        title="Defined Embed"
        src={fullUrl}
        frameBorder="0"
        allow="clipboard-write"
      />
    </div>
  );
}

export default memo(TradingViewWidget);
