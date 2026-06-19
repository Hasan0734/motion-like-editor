

import { Editor } from '@tiptap/react'

export function addRow(editor: Editor) {
  editor.chain().focus().addRowAfter().run()
}

export function addColumn(editor: Editor) {
  editor.chain().focus().addColumnAfter().run()
}

export function deleteRow(editor: Editor) {
  editor.chain().focus().deleteRow().run()
}

export function deleteColumn(editor: Editor) {
  editor.chain().focus().deleteColumn().run()
}