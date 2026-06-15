import { LucideIcon } from "lucide-react";
import TooltipWrapper from "./TooltipWrapper";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import React from "react";

interface ToggleButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon | React.JSX.Element;
  className?: string;
  text?: string;
  showTooltip?: boolean;
  tooltip?: string;
  disabled?: boolean;
  size?:
    | "icon"
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
  [key: string]: any
}

const ToggleButton = ({
  onClick,
  isActive,
  icon,
  className,
  text,
  size,
  showTooltip,
  tooltip,
  disabled,
  ...props
}: ToggleButtonProps) => {

const renderIcon = () => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        // @ts-ignore - merging classNames safely depending on how your icons accept them
        className: cn("stroke-[2.75]", icon.props && (icon.props as any).className)
      });
    }
    
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="stroke-[2.75]" />;
  };

  return (
    <TooltipWrapper content={tooltip} showTooltip={showTooltip}>
      <Button
        size={size ? size : text ? "default" : "icon"}
        variant={isActive ? "secondary" : "ghost"}
        className={cn("",className)}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {renderIcon()} {text}
      </Button>
    </TooltipWrapper>
  );
};

export default ToggleButton;
