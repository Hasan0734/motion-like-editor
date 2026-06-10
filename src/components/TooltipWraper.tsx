import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import React from "react";
import { Button } from "./ui/button";

interface PropsType {
  children: React.ReactNode;
  title: string | undefined;
  showTooltip?: boolean;
}

const TooltipWraper = ({ children, title, showTooltip = true }: PropsType) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      {showTooltip && title && (
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export default TooltipWraper;
