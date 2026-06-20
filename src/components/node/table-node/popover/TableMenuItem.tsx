import { LucideIcon } from "lucide-react";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { ITEM_CLASSNAME } from "./TableMenuPopover";

interface MenuItemProps {
  icon: LucideIcon | any;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

// Reusable item wrapper
export const TableMenuItem = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
}: MenuItemProps) => {
  return (
    <DropdownMenuItem
      className={cn(ITEM_CLASSNAME, {
        "text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive":
          variant === "destructive",
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground":
          variant === "default",
      })}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </DropdownMenuItem>
  );
};
