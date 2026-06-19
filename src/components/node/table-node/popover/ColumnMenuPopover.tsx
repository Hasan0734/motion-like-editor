import {
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  ArrowDownZA,
  ArrowLeft,
  ArrowRight,
  ArrowUpAZ,
  CopyIcon,
  EllipsisIcon,
  PaintBucket,
  SquareX,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  Trash,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { columnMenuPluginKey } from "../plugins/table-menu-handle-plugin";
import { Editor } from "@tiptap/core";
import { InsertLeftColumn, InsertRightColumn } from "~/components/icons";
import { AlignmentIcon } from "~/components/color/icon";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ColorsDropdwon } from "./Colors";
import { AlignmentDropdown } from "./AlignmentContent";

const className = "py-1.5 rounded-lg text-muted-foreground font-medium";

export const ColumnMenuPopover = ({ editor }: { editor: Editor }) => {
  const [opened, setOpened] = useState(false);
  return (
    <DropdownMenu
      open={opened}
      onOpenChange={(op) => {
        setOpened(op);
        editor
          .chain()
          .command(({ tr }) => {
            tr.setMeta(columnMenuPluginKey, { openedMenu: op });
            return true;
          })
          .run();
      }}
    >
      <DropdownMenuTrigger
        className={cn("w-full h-3 rounded flex items-center justify-center", {
          "bg-primary text-primary-foreground": opened,
          "bg-secondary hover:bg-secondary/70 text-secondary-foreground":
            !opened,
        })}
      >
        <EllipsisIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" shadow-xl w-60 pr-px" align="start">
        <ScrollArea className="h-80 overflow-hidden overflow-y-auto p-0.5 pr-3">
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
            }}
          >
            <ArrowLeft /> Move column left
          </DropdownMenuItem>
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
            }}
          >
            <ArrowRight /> Move column right
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addColumnBefore().run();
            }}
          >
            <InsertLeftColumn /> Insert column left
          </DropdownMenuItem>
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            <InsertRightColumn /> Insert column right
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            <ArrowUpAZ /> Sort column A-Z
          </DropdownMenuItem>
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            <ArrowDownZA /> Sort column Z-A
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <ColorsDropdwon editor={editor} />
          <AlignmentDropdown editor={editor} />

          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            <SquareX /> Clear column contents
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
            }}
          >
            <CopyIcon /> Duplicate column
          </DropdownMenuItem>
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
            }}
            variant="destructive"
          >
            <Trash /> Delete column
          </DropdownMenuItem>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AlignmentContent = () => {
  return (
    <DropdownMenuPortal>
      <DropdownMenuSubContent sideOffset={8} alignOffset={-90} className="w-50">
        <DropdownMenuItem className={className}>
          <TextAlignStart /> Align left
        </DropdownMenuItem>
        <DropdownMenuItem className={className}>
          <TextAlignCenter /> Align center
        </DropdownMenuItem>
        <DropdownMenuItem className={className}>
          <TextAlignEnd /> Align right
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={className}>
          <AlignVerticalJustifyStart /> Align top
        </DropdownMenuItem>
        <DropdownMenuItem className={className}>
          <AlignVerticalJustifyCenter />
          Align middle
        </DropdownMenuItem>
        <DropdownMenuItem className={className}>
          <AlignVerticalJustifyEnd />
          Align bottom
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  );
};
