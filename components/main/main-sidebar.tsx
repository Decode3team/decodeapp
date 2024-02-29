'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import MainDecode from './main-decode';
import MainNav, { NavData } from './main-nav';
import { ScrollArea } from '../ui/scroll-area';
import { trpc } from '@/app/_trpc/client';

type MainSidebarProps = {
  collapsed: boolean;
  mainNavigation: NavData[];
};

function MainSidebar({ collapsed = false, mainNavigation }: Readonly<MainSidebarProps>) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const collapseHandler = () => {
    setIsCollapsed((p) => {
      document.cookie = `react-layout:collapsed=${JSON.stringify(!p)}`;

      return !p;
    });
  };

  const { data } = trpc['decode-networks'].useQuery();

  console.log('>>>', data);

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
          <Separator />
        </div>
      </ScrollArea>
    </div>
  );
}

export default MainSidebar;
