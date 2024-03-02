'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import MainDecode from './main-decode';
import MainNav, { NavData } from './main-nav';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSearchParams } from 'next/navigation';
import { DefinedNetwork } from '@/lib/defined/schema/defined-network.schema';
import { useRouter } from '@/hooks/useRouter';

type MainSidebarProps = {
  collapsed: boolean;
  mainNavigation: NavData[];
  networks: DefinedNetwork[];
};

function MainSidebar({ collapsed = false, mainNavigation, networks }: Readonly<MainSidebarProps>) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [selectedNetwork, setSelectedNetwork] = useState<DefinedNetwork | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  const collapseHandler = () => {
    setIsCollapsed((p) => {
      document.cookie = `react-layout:collapsed=${JSON.stringify(!p)}`;

      return !p;
    });
  };

  const networkClickHandler = (network: DefinedNetwork) => {
    setSelectedNetwork(network);
    const url = new URL(window.location.href);
    const resolution = url.searchParams.get('resolution');

    url.searchParams.set('id', network.id.toString().toLowerCase());
    url.searchParams.set('resolution', resolution ?? '1D');

    router.push(`/?${url.searchParams.toString()}`);
  };

  const isCurrentNetwork = (network: DefinedNetwork) => {
    const networkId = String(selectedNetwork?.id).toLowerCase() ?? '';

    return networkId === network.id.toString().toLowerCase();
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const noSelectedNetwork = !url.searchParams.get('id');

    if (noSelectedNetwork) {
      setSelectedNetwork(null);
    }
  }, [params]);

  return (
    <div
      className={cn(
        'dark:bg-[#191A17] bg-[#f1f1f1] max-h-svh sticky top-0 overflow-clip',
        isCollapsed && 'w-[60px] min-w-[60px] transition-all duration-300 ease-in-out',
        !isCollapsed && 'w-[250px] min-w-[250px] transition-all duration-300 ease-in-out',
      )}>
      <MainDecode isCollapsed={isCollapsed} onClick={collapseHandler} />
      <Separator />
      <ScrollArea className="h-full">
        <div className="p-2 pb-40">
          <div>
            {mainNavigation.map((nav) => (
              <MainNav key={nav.name} data={nav} collapsed={isCollapsed} />
            ))}
          </div>
          <Separator className="my-2" />
          <div>
            {networks?.map((network) => (
              <MainNav
                className="mb-1"
                key={network.id}
                active={isCurrentNetwork(network)}
                data={{
                  name: network.nameString,
                  onClick: () => networkClickHandler(network),
                  icon: (
                    <Avatar className="w-[22px] h-[22px] dark:bg-slate-950">
                      <AvatarImage src={network.logo} srcSet={`${network.logo} 2x`} />
                      <AvatarFallback className="text-[10px]">
                        {network.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ),
                }}
                collapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default MainSidebar;
