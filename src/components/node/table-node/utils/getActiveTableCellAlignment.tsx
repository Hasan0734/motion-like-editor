import { Editor } from "@tiptap/core";
import { getTableContext } from "./getTableContext";

type HorizontalAlign = "left" | "center" | "right" | "justify";
type VerticalAlign = "top" | "middle" | "bottom";

interface TableAlignmentState {
  isInsideTable: boolean;
  horizontal: HorizontalAlign;
  vertical: VerticalAlign;
}

/**
 * Extracts the active alignment values from the currently selected or focused table cell.
 * Returns defaults if the selection is outside a table structure.
 */
export const getActiveTableCellAlignment = (
  editor: Editor | null,
): TableAlignmentState => {
  const defaultState: TableAlignmentState = {
    isInsideTable: false,
    horizontal: "left",
    vertical: "top",
  };

  if (!editor) return defaultState;

  // Use the shared context helper to safely extract current cell node data
  const context = getTableContext(editor.state);
  if (!context) return defaultState;

  const { tableNode, map, cellPos } = context;

  // Find the cell node at the active coordinate within the transaction document
  const cellNode = editor.state.doc.nodeAt(cellPos);
  if (!cellNode) return defaultState;

  return {
    isInsideTable: true,
    // Safely read the attributes with custom fallbacks if undefined
    horizontal: (cellNode.attrs.alignment as HorizontalAlign) || "left",
    vertical: (cellNode.attrs.verticalAlignment as VerticalAlign) || "top",
  };
};
