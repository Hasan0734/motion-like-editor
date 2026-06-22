import { PaintBucket } from "lucide-react";
import { ITEM_CLASSNAME } from "../node/table-node/popover/TableMenuPopover";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import { ColorItem } from "./ColorItem";
import { ScrollArea } from "../ui/scroll-area";
import { Color, GroupColors } from "./type";
import { Editor } from "@tiptap/core";
import { getRecentColors } from "./utils";
import { useState } from "react";
import { groupColors } from "./constant";

const Colors = ({
  editor,
  setColor,
}: {
  editor: Editor | null;
  setColor: (color: Color) => void;
}) => {
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
                    onClick={() => setColor(color)}
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

export default Colors;
