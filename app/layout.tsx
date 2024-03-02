import './globals.css';
import { ArrowDownUp, BarChart2, Bell, Star, Wallet } from 'lucide-react';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { ThemeProvider } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import TRPCProvider from './_trpc/trpc-provider';
import MainSidebar from '@/components/main/main-sidebar';
import NetworkProviders from '@/providers/network-provider';
import { serverClient } from './_trpc/server-client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Decode',
  description: 'on-chain crypto metrics ',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collapsed = cookies().get('react-layout:collapsed');
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  const mainNav = [
    {
      name: 'Watchlist',
      href: '/watchlist',
      icon: <Star size={18} />,
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: <Bell size={18} />,
    },
    {
      name: 'Top Tokens',
      href: '/top-tokens',
      icon: <BarChart2 size={18} />,
    },
    {
      name: 'Gainers & Losers',
      href: '/top-tokens',
      icon: <ArrowDownUp size={18} />,
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: <Wallet size={18} />,
    },
    {
      name: 'Insider',
      href: '/insider',
      icon: <Bell size={18} />,
    },
  ];

  const networks = await serverClient['decode-networks']();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'dark:bg-stone-950')} suppressHydrationWarning>
        <TRPCProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
            <NetworkProviders>
              <main className="flex flex-row min-h-screen relative">
                <MainSidebar
                  collapsed={defaultCollapsed}
                  mainNavigation={mainNav}
                  networks={networks}
                />
                <div className="flex grow min-h-screen p-4 max-w-full overflow-x-clip justify-center">
                  {children}
                </div>
              </main>
            </NetworkProviders>
          </ThemeProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
