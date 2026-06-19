import { EllipsisIcon, EqualIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { useEditorState } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import { CellSelection, deleteCellSelection } from "@tiptap/pm/tables";

interface CellMenusState {
  canMergeCell: boolean;
  canSplitCell: boolean;
  canClearContents: boolean;
}

export const CellMenuPopover = ({ editor }: { editor: Editor }) => {
  const [opened, setOpened] = useState(false);
  const { canMergeCell, canSplitCell, canClearContents } =
    useEditorState<CellMenusState>({
      editor: editor,
      equalityFn: (a, b) => {
        return (
          a.canMergeCell === b?.canMergeCell &&
          a.canSplitCell === b.canSplitCell &&
          a.canClearContents === b.canClearContents
        );
      },
      selector: (instance) => {
        const editor = instance.editor;
        const { selection } = editor.state;
        const { from, to, ranges } = selection;
        if (!instance.editor.isActive("table")) {
          return {
            canMergeCell: false,
            canSplitCell: false,
            canClearContents: false,
          };
        }

        let hasSpannedCell = false;
        let cellSelectionCount = 0;
        let selectionContentSize = 0;

        if (selection instanceof TextSelection) {
          editor.state.doc.nodesBetween(from, to, (node, pos) => {
            const nodeName = node.type.name;
            if (nodeName === "tableHeader" || nodeName === "tableCell") {
              const cell = editor.view.nodeDOM(pos) as HTMLTableCellElement;
              hasSpannedCell = cell.colSpan > 1 || cell.rowSpan > 1;
              return false;
            }
            return true;
          });
        }

        if (selection instanceof CellSelection) {
          cellSelectionCount = selection.ranges.length;
          for (const range of ranges) {
            const { $from, $to } = range;
            editor.state.doc.nodesBetween($from.pos, $to.pos, (node) => {
              if (node.isTextblock) {
                selectionContentSize += node.content.size;
              }
              return true;
            });
          }
        }

        return {
          canMergeCell: cellSelectionCount > 1,
          canSplitCell: hasSpannedCell,
          canClearContents: selectionContentSize > 0,
        };
      },
    });

  return (
    <DropdownMenu open={opened} onOpenChange={setOpened}>
      <DropdownMenuTrigger
        className={cn(
          "absolute flex items-center justify-center top-1/2 -translate-y-1/2 hover:-right-2.25 bg-primary size-2 hover:size-4 rounded-full cursor-pointer pointer-events-auto",
          {
            "size-4 -right-2.25": opened,
            "-right-1.25": !opened,
          },
        )}
        asChild
      >
        <button
          onPointerDown={(evt) => {
            evt.preventDefault();
            setOpened(true);
          }}
        >
          <EqualIcon
            className={cn(
              "size-3.5 text-primary-foreground opacity-0 hover:opacity-100",
              {
                "opacity-100": opened,
              },
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex max-h-80 w-40 flex-col overflow-hidden overflow-y-auto shadow-xl"
        align="start"
        side="bottom"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            hidden={!canMergeCell}
            onClick={() => {
              editor.chain().focus().mergeCells().run();
            }}
          >
            Merge cells
          </DropdownMenuItem>
          <DropdownMenuItem
            hidden={!canSplitCell}
            onClick={() => {
              editor.chain().focus().splitCell().run();
            }}
          >
            Split cell
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              editor.chain().focus().toggleHeaderCell().run();
            }}
          >
            Toggle header cell
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Alignment</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setCellAttribute("verticalAlign", "top")
                      .run();
                  }}
                >
                  Align top
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setCellAttribute("verticalAlign", "middle")
                      .run();
                  }}
                >
                  Align middle
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setCellAttribute("verticalAlign", "bottom")
                      .run();
                  }}
                >
                  Align bottom
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            hidden={!canClearContents}
            onClick={() => {
              editor
                .chain()
                .focus()
                .command(({ state, dispatch }) => {
                  return deleteCellSelection(state, dispatch);
                })
                .run();
            }}
          >
            Clear contents
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
