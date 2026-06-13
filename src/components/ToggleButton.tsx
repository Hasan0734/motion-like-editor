import { LucideIcon } from "lucide-react";
import TooltipWraper from "./TooltipWraper";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

interface ToggleButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon;
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
}: ToggleButtonProps) => {
  const Icon = icon;

  return (
    <TooltipWraper content={tooltip} showTooltip={showTooltip}>
      <Button
        size={size ? size : text ? "default" : "icon"}
        variant={isActive ? "secondary" : "ghost"}
        className={cn( className)}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className="stroke-[2.75] "/> {text}
      </Button>
    </TooltipWraper>
  );
};

export default ToggleButton;
