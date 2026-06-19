import { Editor } from "@tiptap/react";
import { Fragment } from "@tiptap/pm/model";

/**
 * Inserts a blank row at the very bottom of a table without changing selection.
 */
export function insertRowAtBottom(editor: Editor, tablePos: number, trackHistory = true) {
  const { state, view } = editor;
  const { tr, schema } = state;
  const tableNode = state.doc.nodeAt(tablePos);

  if (!tableNode || tableNode.type.name !== "table") return false;

  const firstRow = tableNode.firstChild;
  if (!firstRow) return false;

  const cells = [];
  for (let i = 0; i < firstRow.childCount; i++) {
    const cell = schema.nodes.tableCell.createAndFill();
    if (cell) cells.push(cell);
  }

  const newRow = schema.nodes.tableRow.create(null, Fragment.from(cells));
  const insertPos = tablePos + tableNode.nodeSize - 1;

  tr.insert(insertPos, newRow);
  tr.setMeta("addToHistory", trackHistory);
  view.dispatch(tr);
  return true;
}

/**
 * Deletes the last row of a table if it is completely empty.
 */
export function deleteEmptyRowFromBottom(editor: Editor, tablePos: number, trackHistory = true) {
  const { state, view } = editor;
  const { tr } = state;
  const tableNode = state.doc.nodeAt(tablePos);

  if (!tableNode || tableNode.type.name !== "table" || tableNode.childCount <= 1) return false;

  const lastRowNode = tableNode.lastChild;
  if (!lastRowNode) return false;

  // Verify row emptiness
  let isEmpty = true;
  lastRowNode.forEach((cell) => {
    if (cell.textContent.trim() !== "") isEmpty = false;
  });

  if (!isEmpty) return false;

  const deletePos = tablePos + tableNode.nodeSize - lastRowNode.nodeSize - 1;
  tr.delete(deletePos, deletePos + lastRowNode.nodeSize);
  tr.setMeta("addToHistory", trackHistory);
  view.dispatch(tr);
  return true;
}