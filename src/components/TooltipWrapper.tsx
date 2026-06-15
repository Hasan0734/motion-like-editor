import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import React from "react";

interface PropsType {
  children: React.ReactNode;
  content: string | undefined;
  showTooltip?: boolean;
  className?: string;
}

const TooltipWrapper = ({
  children,
  content,
  className,
  showTooltip = true,
}: PropsType) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {showTooltip && content && (
        <TooltipContent className={className}>
          <p>{content}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default TooltipWrapper;
