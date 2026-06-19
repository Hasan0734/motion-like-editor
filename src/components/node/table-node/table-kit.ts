import { Extension } from '@tiptap/core'
import { TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { CustomTable } from './CustomTable'

export const CustomTableKit = Extension.create({
    name: 'custom-table-kit',
    

    addExtensions() {
        return [
            CustomTable.configure({
                HTMLAttributes: {
                    class: " w-full! not-prose"
                },
                lastColumnResizable: false,
                allowTableNodeSelection: true,
                resizable: true
            }),
            TableRow,
            TableCell.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        verticalAlign: {
                            default: 'top',
                            parseHTML: (element) => {
                                return element.style.verticalAlign || "top"
                            },
                            renderHTML: (attributes) => {
                                return { style: `vertical-align: ${attributes.verticalAlign}` }
                            }
                        }
                    }
                }
            }).configure({
                HTMLAttributes: {
                    class: "min-w-38 border-default p-2"
                }
            }),
            TableHeader,
        ]
    },
})