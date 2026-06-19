import { Editor } from "@tiptap/core";
import { EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { rowMenuPluginKey } from "../plugins/table-menu-handle-plugin";

export const TableMenuPopover = ({ editor }: { editor: Editor }) => {
  const [opened, setOpened] = useState(false);
  return (
    <DropdownMenu
      open={opened}
      //   onOpenChange={setOpened}
      //   onOpenChangeComplete={(op) => {
      //     editor
      //       .chain()
      //       .command(({ tr }) => {
      //         tr.setMeta(rowMenuPluginKey, { openedMenu: op });
      //         return true;
      //       })
      //       .run();
      //   }}

      onOpenChange={(op) => {
        // 1. Update your open state
        setOpened(op);

        // 2. Execute your Tiptap editor plugin metadata logic immediately
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
        <PlusIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-80 w-40 overflow-hidden overflow-y-auto shadow-xl"
        align="start"
        side="right"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
            }}
          >
            Add row before
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().addRowAfter().run();
            }}
          >
            Add row after
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().deleteRow().run();
            }}
            variant="destructive"
          >
            Delete row
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
