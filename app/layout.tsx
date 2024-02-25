import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TRPCProvider from "./_trpc/TRPCProvider";
import { cn } from "@/lib/utils";
import MainSidebar from "@/components/main/main-sidebar";
import { cookies } from "next/headers";
import { ArrowDownUp, BarChart2, Bell, Star, Wallet } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Decode",
  description: "on-chain crypto metrics ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const collapsed = cookies().get("react-layout:collapsed");
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;
  const mainNav = [
    {
      name: "Watchlist",
      href: "/watchlist",
      icon: <Star size={18} />,
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: <Bell size={18} />,
    },
    {
      name: "Top Tokens",
      href: "/top-tokens",
      icon: <BarChart2 size={18} />,
    },
    {
      name: "Gainers & Losers",
      href: "/top-tokens",
      icon: <ArrowDownUp size={18} />,
    },
    {
      name: "Portfolio",
      href: "/portfolio",
      icon: <Wallet size={18} />,
    },
    {
      name: "Insider",
      href: "/insider",
      icon: <Bell size={18} />,
    },
  ];

  return (
    <html lang="en">
      <body
        className={cn(inter.className, "dark:bg-stone-950")}
        suppressHydrationWarning={true}
      >
        <TRPCProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex flex-row min-h-screen">
              <MainSidebar
                collapsed={defaultCollapsed}
                mainNavigation={mainNav}
              />
              <div className="flex grow min-h-screen p-4 justify-center">
                {children}
              </div>
            </main>
          </ThemeProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
