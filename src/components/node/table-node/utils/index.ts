import { Editor } from '@tiptap/core'
import { getTableContext } from './getTableContext'

/**
 * Checks if any cell in the currently active column contains text content.
 * Used to enable/disable A-Z and Z-A sorting actions.
 */
export const isCurrentColumnSortable = (editor: Editor | null): boolean => {
    if (!editor) return false

    const context = getTableContext(editor.state)
    if (!context) return false

    const { tableNode, map, cellRect } = context
    const currentColumnIndex = cellRect.left

    for (let r = 0; r < map.height; r++) {
        const mapIndex = r * map.width + currentColumnIndex
        const cellLocalPos = map.map[mapIndex]

        const cellNode = tableNode.nodeAt(cellLocalPos)
        if (cellNode && cellNode.textContent.trim().length > 0) {
            return true // At least one cell contains sorting text data
        }
    }

    return false
}

type TableDimension = 'column' | 'row'

/**
 * Checks if there is any text available inside the active column or row.
 * Returns true if content is found, allowing you to enable "Clear Content" buttons.
 * 
 * @param editor The active Tiptap Editor instance.
 * @param dimension The structure to check ('column' | 'row').
 * @returns boolean
 */
export const hasTableDimensionContent = (
    editor: Editor | null,
    dimension: TableDimension
): boolean => {
    if (!editor) return false

    const context = getTableContext(editor.state)
    if (!context) return false

    const { tableNode, map, cellRect } = context

    // 1. Check vertical Column structure
    if (dimension === 'column') {
        const currentColumnIndex = cellRect.left

        for (let r = 0; r < map.height; r++) {
            const mapIndex = r * map.width + currentColumnIndex
            const cellLocalPos = map.map[mapIndex]
            const cellNode = tableNode.nodeAt(cellLocalPos)

            // If a cell exists and has stripped string characters, content is available
            if (cellNode && cellNode.textContent.trim().length > 0) {
                return true
            }
        }
    }

    // 2. Check horizontal Row structure
    if (dimension === 'row') {
        const currentRowIndex = cellRect.top

        for (let c = 0; c < map.width; c++) {
            const mapIndex = currentRowIndex * map.width + c
            const cellLocalPos = map.map[mapIndex]
            const cellNode = tableNode.nodeAt(cellLocalPos)

            if (cellNode && cellNode.textContent.trim().length > 0) {
                return true
            }
        }
    }

    return false
}
