import { useMemo } from "react";
import { TableMenuHandle, TableMenuHandleProps } from "./TableMenuHandle";
import { Editor } from "@tiptap/core";
import {
  columnMenuPluginKey,
  rowMenuPluginKey,
  tableMenuPuginKey,
} from "./plugins/table-menu-handle-plugin";
import { ColumnMenuPopover } from "./popover/ColumnMenuPopover";
import { CellMenuPopover } from "./popover/CellMenuPopover";
import {
  TableSelectionOverlay,
  TableSelectionOverlayProps,
} from "./TableSelectionOverlay";
import { PluginKey } from "@tiptap/pm/state";
import { RowMenuPopover } from "./popover/RowMenuPopover";
import { addColumnPluginKey, addRowPluginKey } from "./plugins/plugin-keys";
import { AddRowButton } from "./AddRowButton";
import { TableAddRowColumnHandle } from "./TableAddRowColumnHandle";

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
      {columnMenuPluginProps && (
        <TableMenuHandle pluginProps={columnMenuPluginProps}>
          <ColumnMenuPopover editor={editor} />
        </TableMenuHandle>
      )}
      {rowMenuPluginProps && (
        <TableMenuHandle pluginProps={rowMenuPluginProps}>
          <RowMenuPopover editor={editor} />
        </TableMenuHandle>
      )}

      <TableAddRowColumnHandle
        pluginProps={{
          editor,
          pluginKey: addRowPluginKey,
        }}
      >
        <AddRowButton editor={editor} />
      </TableAddRowColumnHandle>

      {tableSelectionOverlayProps && (
        <TableSelectionOverlay pluginProps={tableSelectionOverlayProps}>
          <CellMenuPopover editor={editor} />
        </TableSelectionOverlay>
      )}
    </>
  );
};
