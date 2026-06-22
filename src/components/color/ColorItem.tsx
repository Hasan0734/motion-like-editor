import { CSSProperties } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Color } from "./type";
import { TextIcon } from "./icon";

export const ColorItem = ({
  color,
  onClick,
}: {
  color: Color;
  onClick: () => void;
}) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className="py-1.5 rounded-lg text-muted-foreground px-2.5 gap-2"
    >
      {color.type === "text" ? (
        <span
          className="size-5 flex items-center justify-center rounded-full tiptap-button-color-text"
          style={
            {
              color: `var(--tt-color-text-${color.value})`,
              "--color-text-button-color": `var(--tt-color-text-${color.value})`,
            } as CSSProperties
          }
        >
          <TextIcon />
        </span>
      ) : (
        <span
          className="size-5 flex items-center justify-center rounded-full tiptap-button-highlight"
          style={
            {
              "--highlight-color":
                color.value === "default"
                  ? "var(--background)"
                  : `var(--tt-color-highlight-${color.value})`,
            } as CSSProperties
          }
        ></span>
      )}
      {color.name} {color.type}
    </DropdownMenuItem>
  );
};
