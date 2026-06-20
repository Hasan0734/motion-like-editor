import { Editor } from '@tiptap/core'
import { TableMap } from '@tiptap/pm/tables'
import { ResolvedPos } from '@tiptap/pm/model'

interface CellSelection extends Selection {
    $anchor: any
    anchorCell?: ResolvedPos
}

interface TableMatrixMeta {
    isInsideTable: boolean
    // Column states
    currentColumnIndex: number
    isFirstColumn: boolean
    isLastColumn: boolean
    // Row states
    currentRowIndex: number
    isFirstRow: boolean
    isLastRow: boolean
}
/**
 * Calculates whether the current column is at the boundaries of the table.
 */
export const getTableColumnMeta = (editor: Editor | null): TableMatrixMeta => {
    const defaultMeta: TableMatrixMeta = {
        isInsideTable: false,
        currentColumnIndex: -1,
        isFirstColumn: true,
        isLastColumn: true,
        currentRowIndex: -1,
        isFirstRow: true,
        isLastRow: true
    }

    if (!editor) return defaultMeta

    const { state } = editor
    const selection = state.selection as unknown as CellSelection
    let cellPos: number | null = null

    // 1. Identify selected cell position
    if (selection.anchorCell) {
        cellPos = selection.anchorCell.pos
    } else {
        const $pos = selection.$anchor
        for (let d = $pos.depth; d > 0; d--) {
            const nodeName = $pos.node(d).type.name
            if (nodeName === 'tableCell' || nodeName === 'tableHeader') {
                cellPos = $pos.before(d)
                break
            }
        }
    }



    if (cellPos === null) return defaultMeta

    // 2. Locate parent table node
    const $cellPos = state.doc.resolve(cellPos)
    let tableNode = null
    let tablePos = -1

    for (let d = $cellPos.depth; d > 0; d--) {
        if ($cellPos.node(d).type.name === 'table') {
            tableNode = $cellPos.node(d)
            tablePos = $cellPos.before(d)
            break
        }
    }

    if (!tableNode || tablePos === -1) return defaultMeta

    // 3. Map out table structural dimensions
    const map = TableMap.get(tableNode)
    const localCellPos = cellPos - tablePos - 1


    // 4. Extract boundaries rect using findCell mapping
    // findCell returns: { top: number, bottom: number, left: number, right: number }
    const cellRect = map.findCell(localCellPos)

    // Left property yields the exact 0-indexed column position
    const currentColumnIndex = cellRect.left

    // Top property yields the exact 0-indexed row position
    const currentRowIndex = cellRect.top

    // 5. Compute structural boundary metrics
    return {
        isInsideTable: true,
        currentColumnIndex,
        isFirstColumn: currentColumnIndex === 0,
        isLastColumn: currentColumnIndex === map.width - 1,
        currentRowIndex,
        isFirstRow: currentRowIndex === 0,
        // map.height represents total table rows count
        isLastRow: currentRowIndex === map.height - 1,
    }
}
