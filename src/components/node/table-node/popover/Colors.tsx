import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { PaintBucket } from "lucide-react";
import { CSSProperties, useState } from "react";
import {
  GroupColors,
  getRecentColors,
  groupColors,
  Color,
} from "~/components/color/ColorDropdown";
import { TextIcon } from "~/components/color/icon";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ITEM_CLASSNAME } from "./TableMenuPopover";
import { setTableCellStyles } from "../utils/table";

const RECENT_COLORS_KEY = "recentlyUsedColors";
const MAX_RECENT = 3;

export const ColorsDropdwon = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return;

  const [items, setItems] = useState<GroupColors[]>(() => {
    const recent = getRecentColors();
    if (recent.length > 0) {
      return [{ title: "Recently used", colors: recent }, ...groupColors];
    }
    return groupColors;
  });

  const { textColor, highlightColor } = useEditorState({
    editor,
    selector: (ctx) => ({
      textColor: ctx.editor.getAttributes("textStyle").color,
      highlightColor: ctx.editor.getAttributes("highlight"),
    }),
  });

  const handleAddRecentUsed = (color: Color) => {
    const currentRecent = getRecentColors();

    const filtered = currentRecent.filter(
      (c) => c.value !== color.value || c.type !== color.type,
    );

    const updatedRecent = [color, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updatedRecent));

    setItems(() => {
      const recentItem = { title: "Recently used", colors: updatedRecent };
      return [recentItem, ...groupColors];
    });
  };

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
                      handleAddRecentUsed(color);

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

const ColorItem = ({
  color,
  onClick,
}: {
  color: Color;
  onClick: () => void;
}) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className="py-1.5 rounded-lg text-muted-foreground font-medium px-2.5 gap-2"
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
