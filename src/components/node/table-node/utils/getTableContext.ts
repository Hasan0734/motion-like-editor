import { EditorState } from '@tiptap/pm/state'
import { TableMap } from '@tiptap/pm/tables'
import { ResolvedPos, Node as ProsemirrorNode } from '@tiptap/pm/model'

interface CellSelection extends Selection {
  $anchor: any
  anchorCell?: ResolvedPos
}

export interface TableActionContext {
  tableNode: ProsemirrorNode
  tablePos: number
  map: TableMap
  cellPos: number
  cellRect: { top: number; bottom: number; left: number; right: number }
}

export const getTableContext = (state: EditorState): TableActionContext | null => {
  const selection = state.selection as unknown as CellSelection
  let cellPos: number | null = null

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

  if (cellPos === null) return null

  const $cellPos = state.doc.resolve(cellPos)
  let tableNode: ProsemirrorNode | null = null
  let tablePos = -1

  for (let d = $cellPos.depth; d > 0; d--) {
    if ($cellPos.node(d).type.name === 'table') {
      tableNode = $cellPos.node(d)
      tablePos = $cellPos.before(d)
      break
    }
  }

  if (!tableNode || tablePos === -1) return null

  const map = TableMap.get(tableNode)
  const localCellPos = cellPos - tablePos - 1
  const cellRect = map.findCell(localCellPos)

  return { tableNode, tablePos, map, cellPos, cellRect }
}
