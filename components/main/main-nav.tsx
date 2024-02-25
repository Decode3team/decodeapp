import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, SheetIcon } from "lucide-react";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";

export type NavData = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

function MainNav({ collapsed, data }: { collapsed: boolean; data: NavData }) {
  const router = useRouter();
  const nodeRef = useRef(null);
  const Icon = data.icon;

  return (
    <Link
      href={data.href}
      className={cn(
        "flex w-full rounded-sm hover:bg-stone-700 text-white cursor-pointer flex-nowrap gap-2 p-2",
        collapsed ? "justify-center" : "items-center"
      )}
    >
      {data.icon}
      <div
        ref={nodeRef}
        className={cn("ml-2 whitespace-nowrap", collapsed ? "hidden" : "")}
      >
        {data.name}
      </div>
    </Link>
  );
}

export default MainNav;
