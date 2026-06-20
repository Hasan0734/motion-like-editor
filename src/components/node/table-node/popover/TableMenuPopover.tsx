import { Editor } from "@tiptap/core";
import {
  ArrowDown,
  ArrowDownZA,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpAZ,
  CopyIcon,
  EllipsisIcon,
  EllipsisVerticalIcon,
  PaintBucket,
  PlusIcon,
  SquareX,
  Trash,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { rowMenuPluginKey } from "../plugins/table-menu-handle-plugin";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  InsertLeftColumn,
  InsertRightColumn,
  InsertRowAbove,
  InsertRowBelow,
} from "~/components/icons";
import { AlignmentDropdown } from "./AlignmentContent";
import { TableMenuItem } from "./TableMenuItem";
import { ColorsDropdwon } from "./Colors";
import { deleteCellSelection } from "@tiptap/pm/tables";
import { getTableColumnMeta } from "../utils/getTableColumnMeta";
import { moveActiveColumn } from "../utils/moveActiveColumn";
import { moveActiveRow } from "../utils/moveActiveRow";

export const ITEM_CLASSNAME =
  "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer w-full";

interface TableMenuPopoverProps {
  editor: Editor;
  type: "row" | "column";
  pluginKey: any;
}

export const TableMenuPopover = ({
  editor,
  type,
  pluginKey,
}: TableMenuPopoverProps) => {
  const [opened, setOpened] = useState(false);
  const isRow = type === "row";

  // Dynamic values depending on row vs column context
  const TriggerIcon = isRow ? EllipsisVerticalIcon : EllipsisIcon;
  const triggerStyles = isRow
    ? "w-3 h-full rounded flex items-center justify-center transition-colors"
    : "w-full h-3 rounded flex items-center justify-center transition-colors";

  const handleOpenChange = (op: boolean) => {
    setOpened(op);
    editor
      .chain()
      .command(({ tr }) => {
        tr.setMeta(pluginKey, { openedMenu: op });
        return true;
      })
      .run();
  };

  const { isInsideTable, isFirstColumn, isLastColumn, isFirstRow, isLastRow } =
    getTableColumnMeta(editor);

  return (
    <DropdownMenu open={opened} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        className={cn(triggerStyles, {
          "bg-primary text-primary-foreground": opened,
          "text-secondary-foreground bg-accent":
            !opened,
        })}
      >
        <TriggerIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="shadow-xl w-60 pr-px"
        align="start"
        side={isRow ? "right" : "bottom"}
      >
        <ScrollArea className="h-80 overflow-hidden overflow-y-auto p-0.5 pr-3">
          {/* 1. Re-ordering Actions */}
          <DropdownMenuGroup>
            <TableMenuItem
              icon={isRow ? ArrowUp : ArrowLeft}
              label={isRow ? "Move row up" : "Move column left"}
              onClick={() => {
                if (isRow) {
                  moveActiveRow(editor, "up");
                  return;
                }
                moveActiveColumn(editor, "left");
              }}
              disabled={isRow ? isFirstRow : isFirstColumn}
            />
            <TableMenuItem
              icon={isRow ? ArrowDown : ArrowRight}
              label={isRow ? "Move row down" : "Move column right"}
              onClick={() => {
                if (isRow) {
                  moveActiveRow(editor, "down");
                  return;
                }
                moveActiveColumn(editor, "right");
              }}
              disabled={isRow ? isLastRow : isLastColumn}
            />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* 2. Insertion Actions */}
          <DropdownMenuGroup>
            <TableMenuItem
              icon={isRow ? InsertRowAbove : InsertLeftColumn}
              label={isRow ? "Insert row above" : "Insert column left"}
              onClick={() =>
                isRow
                  ? editor.chain().focus().addRowBefore().run()
                  : editor.chain().focus().addColumnBefore().run()
              }
            />
            <TableMenuItem
              icon={isRow ? InsertRowBelow : InsertRightColumn}
              label={isRow ? "Insert row below" : "Insert column right"}
              onClick={() =>
                isRow
                  ? editor.chain().focus().addRowAfter().run()
                  : editor.chain().focus().addColumnAfter().run()
              }
            />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* 3. Sorting Actions */}
          <DropdownMenuGroup>
            <TableMenuItem
              icon={ArrowUpAZ}
              label={isRow ? "Sort row A-Z" : "Sort column A-Z"}
              onClick={() => editor.chain().focus().run()}
            />
            <TableMenuItem
              icon={ArrowDownZA}
              label={isRow ? "Sort row Z-A" : "Sort column Z-A"}
              onClick={() => editor.chain().focus().run()}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <ColorsDropdwon editor={editor} />
            <AlignmentDropdown editor={editor} />
            <TableMenuItem
              icon={SquareX}
              label={isRow ? "Clear row contents" : "Clear column contents"}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .command(({ state, dispatch }) => {
                    return deleteCellSelection(state, dispatch);
                  })
                  .run()
              }
            />
          </DropdownMenuGroup>

          {/* 5. Utility Content Modification Actions */}

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <TableMenuItem
              icon={CopyIcon}
              label={isRow ? "Duplicate row" : "Duplicate column"}
              onClick={() => editor.chain().focus().run()}
            />

            {/* 6. Destructive Delete Actions */}
            <TableMenuItem
              icon={Trash}
              label={isRow ? "Delete row" : "Delete column"}
              variant="destructive"
              onClick={() =>
                isRow
                  ? editor.chain().focus().deleteRow().run()
                  : editor.chain().focus().deleteColumn().run()
              }
            />
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
