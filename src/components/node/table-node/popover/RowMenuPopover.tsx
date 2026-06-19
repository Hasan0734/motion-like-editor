import { Editor } from "@tiptap/core";
import {
  ArrowDown,
  ArrowDownZA,
  ArrowUp,
  ArrowUpAZ,
  CopyIcon,
  EllipsisVerticalIcon,
  PaintBucket,
  SquareX,
  Trash,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { rowMenuPluginKey } from "../plugins/table-menu-handle-plugin";
import { ScrollArea } from "~/components/ui/scroll-area";
import { InsertRowAbove, InsertRowBelow } from "~/components/icons";
import { AlignmentIcon } from "~/components/color/icon";
import { AlignmentContent } from "./ColumnMenuPopover";
import { ColorsDropdwon } from "./Colors";
import { AlignmentDropdown } from "./AlignmentContent";

const className = "py-1.5 rounded-lg text-muted-foreground font-medium";

export const RowMenuPopover = ({ editor }: { editor: Editor }) => {
  const [opened, setOpened] = useState(false);
  return (
    <DropdownMenu
      open={opened}
      onOpenChange={(op) => {
        setOpened(op);
        editor
          .chain()
          .command(({ tr }) => {
            tr.setMeta(rowMenuPluginKey, { openedMenu: op });
            return true;
          })
          .run();
      }}
    >
      <DropdownMenuTrigger
        className={cn("w-3 rounded flex items-center justify-center h-full", {
          "bg-primary text-primary-foreground": opened,
          "text-secondary-foreground bg-secondary hover:bg-secondary/70":
            !opened,
        })}
      >
        <EllipsisVerticalIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className=" shadow-xl w-60 pr-px"
        align="start"
        side="right"
      >
        <ScrollArea className="h-80 overflow-hidden overflow-y-auto p-0.5 pr-3">
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
            }}
          >
            <ArrowUp /> Move row up
          </DropdownMenuItem>
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
            }}
          >
            <ArrowDown /> Move row down
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
            }}
          >
            <InsertRowAbove /> Insert row above
          </DropdownMenuItem>
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addRowAfter().run();
            }}
          >
            <InsertRowBelow /> Insert row below
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            <ArrowUpAZ /> Sort row A-Z
          </DropdownMenuItem>
          <DropdownMenuItem
            className={className}
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            <ArrowDownZA /> Sort row Z-A
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
              editor.chain().focus().deleteRow().run();
            }}
            variant="destructive"
          >
            <Trash /> Delete row
          </DropdownMenuItem>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
