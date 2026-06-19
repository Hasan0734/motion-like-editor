import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { columnMenuPluginKey } from "../plugins/table-menu-handle-plugin";
import { Editor } from "@tiptap/core";

export const ColumnMenuPopover = ({ editor }: { editor: Editor }) => {
  const [opened, setOpened] = useState(false);
  return (
    <DropdownMenu
      open={opened}
      onOpenChange={(op) => {
        // 1. Update your open state
        setOpened(op);

        // 2. Execute your Tiptap editor plugin metadata logic immediately
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
      <DropdownMenuContent
        className="max-h-80 w-40 overflow-hidden overflow-y-auto shadow-xl"
        align="start"
        // style={{
        //   width: "var(--anchor-width)"
        // }}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().addColumnBefore().run();
            }}
          >
            Add column before
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
            }}
          >
            Add column after
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
            }}
            variant="destructive"
          >
            Delete column
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
