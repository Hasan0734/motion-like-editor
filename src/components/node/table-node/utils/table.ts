import { Editor } from "@tiptap/react";
import { CellSelection, moveTableColumn, moveTableRow, TableMap } from '@tiptap/pm/tables'
import { Fragment, Node as ProsemirrorNode } from '@tiptap/pm/model'
import { getTableContext } from "./getTableContext";

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
/**
 * Moves the currently active table column left or right.
 */
export const moveActiveColumn = (editor: Editor, direction: 'left' | 'right'): boolean => {
  return editor.chain().focus().command(({ state, dispatch }) => {
    const context = getTableContext(state)
    if (!context) return false

    const currentColumnIndex = context.cellRect.left
    const targetColumnIndex = direction === 'left' ? currentColumnIndex - 1 : currentColumnIndex + 1

    if (targetColumnIndex >= 0 && targetColumnIndex < context.map.width) {
      if (dispatch) {
        return moveTableColumn({ from: currentColumnIndex, to: targetColumnIndex })(state, dispatch)
      }
      return true
    }
    return false
  }).run()
}

/**
 * Moves the currently active table row up or down.
 */
export const moveActiveRow = (editor: Editor, direction: 'up' | 'down'): boolean => {
  return editor.chain().focus().command(({ state, dispatch }) => {
    const context = getTableContext(state)
    if (!context) return false

    const currentRowIndex = context.cellRect.top
    const targetRowIndex = direction === 'up' ? currentRowIndex - 1 : currentRowIndex + 1

    if (targetRowIndex >= 0 && targetRowIndex < context.map.height) {
      if (dispatch) {
        return moveTableRow({ from: currentRowIndex, to: targetRowIndex })(state, dispatch)
      }
      return true
    }
    return false
  }).run()
}

/**
 * Duplicates the active row, copying its structure and contents cleanly.
 */
export const duplicateActiveRow = (editor: Editor): boolean => {
  return editor.chain().focus().command(({ state, dispatch }) => {
    const context = getTableContext(state)
    if (!context || !dispatch) return false

    const { tableNode, tablePos, cellRect } = context
    const currentRowIndex = cellRect.top
    const tr = state.tr

    // 1. Capture content of the current row node
    const targetRowNode = tableNode.child(currentRowIndex)
    const duplicatedRow = targetRowNode.copy(Fragment.fromJSON(state.schema, targetRowNode.content.toJSON()))

    // 2. Find absolute character index where the current row ends
    let insertRowOffset = tablePos + 1
    for (let i = 0; i <= currentRowIndex; i++) {
      insertRowOffset += tableNode.child(i).nodeSize
    }

    // 3. Inject the duplicated row node inside the structural transaction
    tr.insert(insertRowOffset, duplicatedRow)
    dispatch(tr)
    return true
  }).run()
}

/**
 * Duplicates the active column, copying cell nodes down the vertical stack.
 */
export const duplicateActiveColumn = (editor: Editor): boolean => {
  return editor.chain().focus().command(({ state, dispatch }) => {
    const context = getTableContext(state)
    if (!context || !dispatch) return false

    const { tableNode, tablePos, map, cellRect } = context
    const currentColumnIndex = cellRect.left
    const tr = state.tr

    // 1. Map out structural changes row-by-row in backward order to safeguard mapping offsets
    let relativePositionOffset = 0

    for (let r = 0; r < map.height; r++) {
      const mapIndex = r * map.width + currentColumnIndex
      const localCellPos = map.map[mapIndex]
      const cellAbsolutePos = tablePos + 1 + localCellPos

      const originalCellNode = state.doc.nodeAt(cellAbsolutePos)
      if (!originalCellNode) continue

      const duplicatedCell = originalCellNode.copy(Fragment.fromJSON(state.schema, originalCellNode.content.toJSON()))

      // Calculate target insertion offset (directly after the original cell ends)
      const insertionPoint = cellAbsolutePos + originalCellNode.nodeSize + relativePositionOffset

      tr.insert(insertionPoint, duplicatedCell)

      // Accumulate mapping position offset shift dynamically inside this transaction cycle
      relativePositionOffset += duplicatedCell.nodeSize
    }

    dispatch(tr)
    return true
  }).run()
}


interface SelectionWithCells extends Selection {
  $anchor: any;
  forEachCell?: (callback: (node: any, pos: number) => void) => void
}

interface CellStylingOptions {
  backgroundColor?: string // e.g., '#ff0000' or 'transparent'
  textColor?: string       // e.g., '#ffffff'
}


export const setTableCellStyles = (
  editor: Editor,
  options: CellStylingOptions
): boolean => {
  const { backgroundColor, textColor } = options

  return editor
    .chain()
    .focus()
    .command(({ state, tr, dispatch }) => {
      const selection = state.selection as unknown as SelectionWithCells
      const cellsToUpdate: number[] = []

      // 1. Gather targeted absolute cell coordinates
      if (selection instanceof CellSelection || selection.forEachCell) {
        // Multi-cell select handle block
        selection.forEachCell!((_node, pos) => {
          cellsToUpdate.push(pos)
        })
      } else {
        // Single cell text cursor placement fallback
        const $pos = selection.$anchor
        for (let d = $pos.depth; d > 0; d--) {
          const nodeName = $pos.node(d).type.name
          if (nodeName === 'tableCell' || nodeName === 'tableHeader') {
            cellsToUpdate.push($pos.before(d))
            break
          }
        }
      }

      if (cellsToUpdate.length === 0) return false

      if (dispatch) {
        cellsToUpdate.forEach((cellPos) => {
          const cellNode = tr.doc.nodeAt(cellPos)
          if (!cellNode) return

          // 2. Set Background Color (Modifies the TD/TH node attributes directly)
          if (backgroundColor !== undefined) {
            const currentAttrs = cellNode.attrs
            tr.setNodeMarkup(cellPos, undefined, {
              ...currentAttrs,
              background: backgroundColor === 'transparent' ? null : backgroundColor,
            })
          }

          // 3. Set Text Color (Modifies internal text nodes within cell boundaries)
          if (textColor !== undefined) {
            const cellContentStart = cellPos + 1
            const cellContentEnd = cellPos + cellNode.nodeSize - 1

            const colorMark = state.schema.marks.textStyle.create({ color: textColor })

            // Remove existing colors within this range to prevent stacked duplicates
            tr.removeMark(cellContentStart, cellContentEnd, state.schema.marks.textStyle)
            // Inject new style mark across the inner text boundaries safely
            tr.addMark(cellContentStart, cellContentEnd, colorMark)
          }
        })

        dispatch(tr)
        return true
      }

      return true
    })
    .run()
}


interface SelectionWithCells extends Selection {
  forEachCell?: (callback: (node: any, pos: number) => void) => void
}

type HorizontalAlign = 'left' | 'center' | 'right' | 'justify'
type VerticalAlign = 'top' | 'middle' | 'bottom'

interface CellAlignmentOptions {
  horizontal?: HorizontalAlign
  vertical?: VerticalAlign
}

export const setTableCellAlignment = (
  editor: Editor,
  options: CellAlignmentOptions
): boolean => {
  const { horizontal, vertical } = options

  return editor
    .chain()
    .focus()
    .command(({ state, tr, dispatch }) => {
      const selection = state.selection as unknown as SelectionWithCells
      const cellsToUpdate: number[] = []

      // 1. Gather all targeted cell positions
      if (selection instanceof CellSelection || selection.forEachCell) {
        selection.forEachCell!((_node, pos) => {
          cellsToUpdate.push(pos)
        })
      } else {
        const $pos = selection.$anchor
        for (let d = $pos.depth; d > 0; d--) {
          const nodeName = $pos.node(d).type.name
          if (nodeName === 'tableCell' || nodeName === 'tableHeader') {
            cellsToUpdate.push($pos.before(d))
            break
          }
        }
      }

      if (cellsToUpdate.length === 0) return false

      if (dispatch) {
        cellsToUpdate.forEach((cellPos) => {
          const cellNode = tr.doc.nodeAt(cellPos)
          if (!cellNode) return

          // Clone existing node attributes to keep colors or spans intact
          const updatedAttrs = { ...cellNode.attrs }

          // 2. Set horizontal property safely
          if (horizontal) {
            updatedAttrs.alignment = horizontal
          }

          // 3. Set vertical property safely
          if (vertical) {
            updatedAttrs.verticalAlignment = vertical
          }

          // 4. Update the node markup structural properties in the transaction
          tr.setNodeMarkup(cellPos, undefined, updatedAttrs)
        })

        dispatch(tr)
        return true
      }

      return true
    })
    .run()
}


/**
 * Sorts table rows based on the text properties of the active column.
 * Skips the first row if it consists purely of tableHeaders.
 */
export const sortActiveColumn = (editor: Editor, order: 'asc' | 'desc'): boolean => {
  return editor
    .chain()
    .focus()
    .command(({ state, dispatch }) => {
      const context = getTableContext(state)
      if (!context || !dispatch) return false

      const { tableNode, tablePos, map, cellRect } = context
      const currentColumnIndex = cellRect.left
      const tr = state.tr

      const rowsData: { rowNode: any; textContent: string }[] = []
      let startRowIndex = 0

      // 1. Detect if the first row is a header row to avoid sorting it
      const firstRowCells = tableNode.child(0)
      const isFirstRowHeader = firstRowCells.child(0).type.name === 'tableHeader'
      if (isFirstRowHeader) {
        startRowIndex = 1
      }

      // 2. Extract and match text data arrays from rows
      for (let r = startRowIndex; r < map.height; r++) {
        const rowNode = tableNode.child(r)
        const mapIndex = r * map.width + currentColumnIndex
        const cellLocalPos = map.map[mapIndex]
        const cellNode = tableNode.nodeAt(cellLocalPos)

        rowsData.push({
          rowNode,
          textContent: cellNode ? cellNode.textContent.trim().toLowerCase() : '',
        })
      }

      // 3. Perform sorting comparison using native JavaScript collators
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
      rowsData.sort((a, b) => {
        const comparison = collator.compare(a.textContent, b.textContent)
        return order === 'asc' ? comparison : -comparison
      })

      // 4. Reconstruct row layouts mapping nodes internally
      const updatedRows: any[] = []
      if (isFirstRowHeader) {
        updatedRows.push(tableNode.child(0)) // Keep header at the top
      }
      rowsData.forEach((item) => updatedRows.push(item.rowNode))

      // 5. Overwrite the table's structural contents inside the transaction safely
      const tableContentStart = tablePos + 1
      const tableContentEnd = tablePos + tableNode.nodeSize - 1

      const newTableContent = Fragment.from(updatedRows)
      tr.replaceWith(tableContentStart, tableContentEnd, newTableContent)

      dispatch(tr)
      return true
    })
    .run()
}
