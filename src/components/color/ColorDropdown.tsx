import { CSSProperties, useState } from "react";

import { ChevronDown } from "lucide-react";
import TooltipWraper from "../TooltipWrapper";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Editor } from "@tiptap/core";
import TextButton from "./TextButton";
import HighlightButton from "./HighlightButton";
import { TextIcon } from "./icon";
import { useEditorState } from "@tiptap/react";

const RECENT_COLORS_KEY = "recentlyUsedColors";
const MAX_RECENT = 3;

export const getRecentColors = (): Color[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(RECENT_COLORS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export type Color = {
  name: string;
  value: string;
  type: string;
};

export type GroupColors = {
  title: string;
  colors: Color[];
};
export const colors: Color[] = [
  {
    name: "Default",
    value: "default",
    type: "",
  },
  {
    name: "Gray",
    value: "gray",
    type: "",
  },
  {
    name: "Brown",
    value: "brown",
    type: "",
  },
  {
    name: "Orange",
    value: "orange",
    type: "",
  },
  {
    name: "Yellow",
    value: "yellow",
    type: "",
  },
  {
    name: "Green",
    value: "green",
    type: "",
  },
  {
    name: "Blue",
    value: "blue",
    type: "",
  },
  {
    name: "Purple",
    value: "purple",
    type: "",
  },
  {
    name: "Pink",
    value: "pink",
    type: "",
  },
  {
    name: "Red",
    value: "red",
    type: "",
  },
];

export const groupColors: GroupColors[] = [
  {
    title: "Text color",
    colors: colors.map((color) => ({ ...color, type: "text" })),
  },
  {
    title: "Background color",
    colors: colors.map((color) => ({ ...color, type: "background" })),
  },
];

const ColorDropdown = ({ editor }: { editor: Editor }) => {
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
    <Popover>
      <TooltipWraper content={"Text color"}>
        <PopoverTrigger asChild>
          <Button variant={"ghost"} className="p-2 gap-1">
            <span
              className="size-5 flex items-center justify-center border rounded-full 
            tiptap-button-color-text-popover"
              style={
                {
                  "--active-highlight-color": highlightColor?.color,
                } as CSSProperties
              }
            >
              <TextIcon style={{ color: textColor }} />
            </span>
            <ChevronDown className="size-3" size={10} />
          </Button>
        </PopoverTrigger>
      </TooltipWraper>
      <DropdwonContent
        items={items}
        editor={editor}
        handleAddRecentUsed={handleAddRecentUsed}
      />
    </Popover>
  );
};

export default ColorDropdown;

const DropdwonContent = ({
  items,
  editor,
  handleAddRecentUsed,
}: {
  items: GroupColors[];
  editor: Editor;
  handleAddRecentUsed: (color: Color) => void;
}) => {
  return (
    <PopoverContent
      onOpenAutoFocus={(e) => e.preventDefault()}
      className="w-47 rounded-2xl p-0 pr-px bg-popover shadow-2xl  z-50 overflow-hidden"
    >
      <ScrollArea className="h-66.25 p-1.5 pr-2.5">
        {items.map((item, idx) => (
          <div key={item.title}>
            <div className="min-w-max flex relative flex-col justify-center align-middle">
              <div className="capitalize pt-3 pb-1 px-1.5 leading-normal font-medium text-xs text-muted-foreground">
                {item.title}
              </div>
              <div className="grid grid-cols-5 gap-0.5 pl-1">
                {item.colors.map((color) =>
                  color.type === "text" ? (
                    <TextButton
                      editor={editor}
                      color={color.value}
                      tooltip={`${color.name} ${color.type}`}
                      onClick={() => {
                        editor
                          .chain()
                          .focus()
                          .setColor(`var(--tt-color-text-${color.value})`)
                          .run();
                        handleAddRecentUsed(color);
                      }}
                    />
                  ) : color.type === "background" ? (
                    <HighlightButton
                      editor={editor}
                      color={color}
                      tooltip={`${color.name} ${color.type}`}
                      onClick={() => {
                        editor
                          .chain()
                          .focus()
                          .toggleHighlight({
                            color: `var(--tt-color-highlight-${color.value})`,
                          })
                          .run();
                        handleAddRecentUsed(color);
                      }}
                    />
                  ) : (
                    ""
                  ),
                )}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </PopoverContent>
  );
};
