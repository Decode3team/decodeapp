import MainLayout from "@/components/main/main-layout";
import {
  ArrowDownUp,
  BarChart2,
  Bell,
  ChevronDown,
  Star,
  Wallet,
} from "lucide-react";
import { cookies } from "next/headers";

export default function Home() {
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

  return <MainLayout mainNavigation={mainNav} collapsed={defaultCollapsed} />;
}
