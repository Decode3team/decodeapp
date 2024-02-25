import "./style.css";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { CSSTransition } from "react-transition-group";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import Link from "next/link";

function MainDecode({
  isCollapsed,
  onClick,
}: {
  isCollapsed: boolean;
  onClick: () => void;
}) {
  const nodeRef = useRef(null);
  const logoRef = useRef(null);

  return (
    <div className="flex flex-col items-center p-3 pt-4 gap-2">
      <div
        className={cn(
          "flex w-full transition-all duration-300 ease-in-out",
          isCollapsed ? "justify-around" : "justify-between"
        )}
      >
        <CSSTransition
          in={!isCollapsed}
          timeout={300}
          classNames="node"
          unmountOnExit
          nodeRef={nodeRef}
        >
          <div ref={nodeRef} className="flex items-center">
            <Link href="/">
              <Image src="/decode.png" alt="Decode" width={140} height={26} />
            </Link>
          </div>
        </CSSTransition>

        <div className="w-[36px]">
          <Button size="icon" onClick={onClick} className="dark:bg-stone-700">
            {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>
        </div>
      </div>

      <div className="h-[36px]">
        <CSSTransition
          in={isCollapsed}
          timeout={300}
          classNames="node"
          unmountOnExit
          nodeRef={logoRef}
        >
          <div ref={logoRef}>
            <Link href="/">
              <Image
                src="/decode-logo.png"
                alt="Decode"
                width={24}
                height={36}
              />
            </Link>
          </div>
        </CSSTransition>
      </div>
    </div>
  );
}

export default MainDecode;
