import Link from 'next/link';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

export type NavData = {
  name: string;
  href: string;
  icon?: React.ReactNode;
};

function MainNav({ collapsed, data }: { collapsed: boolean; data: NavData }) {
  const nodeRef = useRef(null);

  return (
    <Link
      href={data.href}
      className={cn(
        'flex w-full rounded-sm dark:hover:bg-stone-700 dark:text-white cursor-pointer flex-nowrap p-2 transition-colors duration-200 ease-in-out',
        collapsed ? 'justify-center' : 'items-center',
      )}>
      <div className="flex flex-shrink-0">{data.icon ?? null}</div>
      <div
        ref={nodeRef}
        className={cn(
          'whitespace-nowrap flex flex-shrink-0',
          collapsed ? 'hidden' : '',
          data.icon ? 'pl-3' : '',
        )}>
        {data.name}
      </div>
    </Link>
  );
}

export default MainNav;
