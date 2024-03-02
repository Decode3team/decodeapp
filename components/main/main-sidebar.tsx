'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import MainDecode from './main-decode';
import MainNav, { NavData } from './main-nav';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useNetworkProvider } from '@/providers/network-provider';
import { DefinedNetworkModel } from '@/lib/defined/types';

type MainSidebarProps = {
  collapsed: boolean;
  mainNavigation: NavData[];
  networks: DefinedNetworkModel[];
};

function MainSidebar({ collapsed = false, mainNavigation, networks }: Readonly<MainSidebarProps>) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const { selectedNetwork, setSelectedNetwork } = useNetworkProvider();
  const collapseHandler = () => {
    setIsCollapsed((p) => {
      document.cookie = `react-layout:collapsed=${JSON.stringify(!p)}`;

      return !p;
    });
  };

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
                key={network.id}
                active={selectedNetwork?.id === network.id}
                className="mb-1"
                data={{
                  name: network.nameString,
                  onClick: () => setSelectedNetwork(network),
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
