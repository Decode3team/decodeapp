import "./style.css";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { CSSTransition } from "react-transition-group";
import { cn } from "@/lib/utils";
import { useRef } from "react";

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
    <div className="flex flex-col items-center p-3 gap-2">
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
          <div ref={nodeRef}>
            <Image src="/decode.png" alt="Decode" width={190} height={36} />
          </div>
        </CSSTransition>

        <Button size="icon" onClick={onClick}>
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </Button>
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
            <Image src="/decode-logo.png" alt="Decode" width={24} height={36} />
          </div>
        </CSSTransition>
      </div>
    </div>
  );
}

export default MainDecode;
