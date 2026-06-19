import { Editor } from "@tiptap/react";
import { Fragment } from "@tiptap/pm/model";
import { TableMap } from "@tiptap/pm/tables";

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


/**
 * Appends a structural blank column at the far right edge of a targeted table pos.
 */
export function insertColumnAtRight(editor: Editor, tablePos: number, addToHistory = true): boolean {
  const { state, view } = editor;
  let { tr } = state;

  const tableNode = state.doc.nodeAt(tablePos);
  if (!tableNode || tableNode.type.name !== "table") return false;

  const map = TableMap.get(tableNode);

  const lastColIndex = map.width;

  const cellPos = map.positionAt(0, lastColIndex, tableNode);
  const absoluteCellPos = tablePos + cellPos;

  try {
    editor.chain()
      .focus()
      .setTextSelection(absoluteCellPos)
      .addColumnAfter()
      .run();

    setColumnWidth(
      editor,
      tablePos,
      lastColIndex,
      200
    );

    if (!addToHistory) {
      tr.setMeta("addToHistory", false);
    }

    return true;
  } catch (error) {
    console.error("Failed to insert column at the right edge:", error);
    return false;
  }
}

/**
 * Removes the column on the far right edge if it contains no content.
 */
export function deleteEmptyColumnFromRight(editor: Editor, tablePos: number, trackHistory = true) {
  const { state, view } = editor;
  const { tr } = state;
  const tableNode = state.doc.nodeAt(tablePos);

  if (!tableNode || tableNode.type.name !== "table") return false;

  const firstRow = tableNode.firstChild;
  if (!firstRow || firstRow.childCount <= 1) return false;

  const lastColumnIndex = firstRow.childCount - 1;
  let isColumnEmpty = true;

  // Double-check emptiness across all stacked rows before deletion
  tableNode.forEach((rowNode) => {
    const lastCell = rowNode.child(lastColumnIndex);
    if (lastCell && lastCell.textContent.trim() !== "") {
      isColumnEmpty = false;
    }
  });

  if (!isColumnEmpty) return false;

  const reverseRows: { pos: number; size: number }[] = [];
  tableNode.forEach((rowNode, rowOffset) => {
    let cellOffset = 1;
    for (let i = 0; i < lastColumnIndex; i++) {
      cellOffset += rowNode.child(i).nodeSize;
    }
    const targetCell = rowNode.child(lastColumnIndex);
    reverseRows.unshift({
      pos: tablePos + 1 + rowOffset + cellOffset,
      size: targetCell.nodeSize
    });
  });

  reverseRows.forEach(({ pos, size }) => {
    tr.delete(pos, pos + size);
  });

  tr.setMeta("addToHistory", trackHistory);
  view.dispatch(tr);
  return true;
}



function setColumnWidth(
  editor: Editor,
  tablePos: number,
  columnIndex: number,
  width: number
) {
  const { state, view } = editor;
  let tr = state.tr;

  const table = state.doc.nodeAt(tablePos);

  if (!table) return false;

  const map = TableMap.get(table);

  for (let row = 0; row < map.height; row++) {
    const cellPos = map.positionAt(row, columnIndex, table);
    const absolutePos = tablePos + cellPos;

    const cell = tr.doc.nodeAt(absolutePos);

    if (!cell) continue;

    tr.setNodeMarkup(absolutePos, undefined, {
      ...cell.attrs,
      colwidth: [width],
    });
  }

  view.dispatch(tr);

  return true;
}