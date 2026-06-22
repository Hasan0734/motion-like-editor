import { Editor } from "@tiptap/core";
import { PaintBucket } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ITEM_CLASSNAME } from "./TableMenuPopover";
import { setTableCellStyles } from "../utils/table";
import { ColorItem } from "~/components/color/ColorItem";
import { getRecentColors, handleAddRecentUsed } from "~/components/color/utils";
import { GroupColors } from "~/components/color/type";
import { groupColors } from "~/components/color/constant";



export const ColorsDropdwon = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return;

  const [items, setItems] = useState<GroupColors[]>(() => {
    const recent = getRecentColors();
    if (recent.length > 0) {
      return [{ title: "Recently used", colors: recent }, ...groupColors];
    }
    return groupColors;
  });

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={ITEM_CLASSNAME}>
        <PaintBucket className="size-4 shrink-0 text-muted-foreground" />
        <span>Color</span>
      </DropdownMenuSubTrigger>

      <DropdownMenuPortal>
        <DropdownMenuSubContent sideOffset={8} className="w-55 pr-px z-120">
          <ScrollArea className="h-90 p-0.5 pr-3">
            {items.map((item) => (
              <DropdownMenuGroup key={item.title}>
                <DropdownMenuLabel className="text-foreground">
                  {item.title}
                </DropdownMenuLabel>
                {item.colors.map((color) => (
                  <ColorItem
                    onClick={() => {
                      //   setTableCellStyles(editor, {
                      //     backgroundColor: "#3b82f6", // Tailwind Blue 500
                      //     textColor: "#ffffff", // White Text
                      //   });
                      handleAddRecentUsed(color, setItems);

                      if (color.type === "background") {
                        setTableCellStyles(editor, {
                          backgroundColor: `var(--tt-color-text-${color.value})`,
                        });
                        return;
                      }

                      setTableCellStyles(editor, {
                        textColor: `var(--tt-color-text-${color.value})`,
                      });
                    }}
                    key={color.value}
                    color={color}
                  />
                ))}
              </DropdownMenuGroup>
            ))}
          </ScrollArea>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
