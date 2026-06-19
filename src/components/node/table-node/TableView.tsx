// import { updateColumns } from '@tiptap/extension-table'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { EditorView, NodeView, ViewMutationRecord } from '@tiptap/pm/view'
import { updateColumns } from './utils/updateColumns'

export class CustomTableView implements NodeView {
  node: ProseMirrorNode
  cellMinWidth: number
  
  // 1. "dom" is the root element ProseMirror mounts in the editor
  dom: HTMLDivElement 
  tableWrapper: HTMLDivElement
  tableContainer: HTMLDivElement
  table: HTMLTableElement
  colgroup: HTMLTableColElement
  
  // 2. "contentDOM" is where ProseMirror streams the inner rows/cells
  contentDOM: HTMLTableSectionElement

  constructor(
    node: ProseMirrorNode,
    cellMinWidth: number,
    _view?: EditorView,
    HTMLAttributes: Record<string, any> = {},
  ) {
    this.node = node
    this.cellMinWidth = cellMinWidth

    // Outer Node Wrapper: <div data-content-type="table">
    this.dom = document.createElement('div')
    this.dom.setAttribute('data-content-type', 'table')

    
    // Wrapper Shell: <div class="tableWrapper">
    this.tableWrapper = document.createElement('div')
    this.tableWrapper.className = 'tableWrapper'
    this.dom.appendChild(this.tableWrapper)

    // Inner Container: <div class="table-container">
    this.tableContainer = document.createElement('div')
    this.tableContainer.className = 'table-container'
    this.tableWrapper.appendChild(this.tableContainer)

    // The actual raw table element
    this.table = document.createElement('table')
    this.tableContainer.appendChild(this.table)

    // Apply standard configurations & custom attributes
    for (const [key, value] of Object.entries(HTMLAttributes)) {
      if (value !== undefined && value !== null) {
        if (key === 'style') {
          this.table.style.cssText = String(value)
        } else {
          this.table.setAttribute(key, String(value))
        }
      }
    }

    if (node.attrs.style) {
      this.table.style.cssText = node.attrs.style
    }

    // Append column definitions for resizing calculations
    this.colgroup = this.table.appendChild(document.createElement('colgroup'))
    updateColumns(node, this.colgroup, this.table, cellMinWidth)
    
    // Establish the editing content destination (tbody)
    this.contentDOM = this.table.appendChild(document.createElement('tbody'))

    // Inject your custom UI controls container alongside the table structure
    // this.renderTableControls()
  }

//   renderTableControls() {
//     const controlsContainer = document.createElement('div')
//     controlsContainer.className = 'table-controls'
//     controlsContainer.style.position = 'relative'

//     const portal = document.createElement('div')
//     portal.id = 'random'
//     portal.setAttribute('data-floating-ui-portal', '')

//     const innerMenu = document.createElement('div')
//     // Add custom buttons / interactive handles here...
//     innerMenu.className = 'custom-floating-menu'

//     portal.appendChild(innerMenu)
//     controlsContainer.appendChild(portal)
//     this.tableWrapper.appendChild(controlsContainer)
//   }

  update(node: ProseMirrorNode) {
    if (node.type !== this.node.type) {
      return false
    }

    this.node = node
    updateColumns(node, this.colgroup, this.table, this.cellMinWidth)
    return true
  }

  ignoreMutation(mutation: ViewMutationRecord) {
    const target = mutation.target as Node
    const isInsideWrapper = this.dom.contains(target)
    const isInsideContent = this.contentDOM.contains(target)

    // Let ProseMirror ignore modifications happening within the controls portal
    if (isInsideWrapper && !isInsideContent) {
      if (
        mutation.type === 'attributes' ||
        mutation.type === 'childList' ||
        mutation.type === 'characterData'
      ) {
        return true
      }
    }
    return false
  }
}