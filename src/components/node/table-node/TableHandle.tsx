import { useMemo } from "react";
import { TableMenuHandle, TableMenuHandleProps } from "./TableMenuHandle";
import { Editor } from "@tiptap/core";
import {
  columnMenuPluginKey,
  rowMenuPluginKey,
} from "./plugins/table-menu-handle-plugin";
import { CellMenuPopover } from "./popover/CellMenuPopover";
import {
  TableSelectionOverlay,
  TableSelectionOverlayProps,
} from "./TableSelectionOverlay";
import { PluginKey } from "@tiptap/pm/state";
import { addRowPluginKey } from "./plugins/plugin-keys";
import { AddRowButton } from "./AddRowButton";
import { TableAddRowColumnHandle } from "./TableAddRowColumnHandle";
import { TableMenuPopover } from "./popover/TableMenuPopover";

export const TableHandle = ({ editor }: { editor: Editor | null }) => {
  const columnMenuPluginProps = useMemo(() => {
    if (!editor) {
      return undefined;
    }
    return {
      editor,
      menuType: "column",
      pluginKey: columnMenuPluginKey,
      options: {
        placement: "top-start",
        offset: {
          mainAxis: 4,
        },
      },
    } satisfies TableMenuHandleProps["pluginProps"];
  }, [editor]);

  const rowMenuPluginProps = useMemo(() => {
    if (!editor) {
      return undefined;
    }
    return {
      editor,
      menuType: "row",
      pluginKey: rowMenuPluginKey,
      options: {
        placement: "left-start",
        offset: {
          mainAxis: 4,
        },
      },
    } satisfies TableMenuHandleProps["pluginProps"];
  }, [editor]);

  const tableSelectionOverlayProps = useMemo(() => {
    if (!editor) {
      return undefined;
    }
    return {
      editor,
      pluginKey: new PluginKey("table-selection-overlay"),
    } satisfies TableSelectionOverlayProps["pluginProps"];
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <>
      <div>
        {columnMenuPluginProps && (
          <TableMenuHandle pluginProps={columnMenuPluginProps}>
            {/* <ColumnMenuPopover editor={editor} /> */}

            <TableMenuPopover
              pluginKey={columnMenuPluginKey}
              type="column"
              editor={editor}
            />
          </TableMenuHandle>
        )}
        {rowMenuPluginProps && (
          <TableMenuHandle pluginProps={rowMenuPluginProps}>
            {/* <RowMenuPopover editor={editor} /> */}

            <TableMenuPopover
              pluginKey={rowMenuPluginKey}
              type="row"
              editor={editor}
            />
          </TableMenuHandle>
        )}
      </div>

      <TableAddRowColumnHandle
        pluginProps={{
          editor,
          pluginKey: addRowPluginKey,
        }}
      >
        <AddRowButton editor={editor} />
      </TableAddRowColumnHandle>

      {/* <TableAddColumnHandle
        pluginProps={{
          editor,
          pluginKey: addColumnPluginKey,
        }}
      >
        <AddColumnButton editor={editor} />
      </TableAddColumnHandle> */}

      {tableSelectionOverlayProps && (
        <TableSelectionOverlay pluginProps={tableSelectionOverlayProps}>
          <CellMenuPopover editor={editor} />
        </TableSelectionOverlay>
      )}
    </>
  );
};
