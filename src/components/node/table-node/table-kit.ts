import { Extension } from '@tiptap/core'
import { TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { CustomTable } from './CustomTable'
import { cn } from '~/lib/utils'

export const CustomTableKit = Extension.create({
    name: 'custom-table-kit',


    addExtensions() {
        return [
            CustomTable.configure({
                HTMLAttributes: {
                    class: cn("table-auto border-collapse w-full not-prose"),
                },
                lastColumnResizable: false,
                allowTableNodeSelection: true,
                resizable: true,
                cellMinWidth: 152
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: cn(
                        "bg-accent border p-2 text-start min-w-37.5 font-semibold"
                    ),
                },
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
                    class: "min-w-38 border border-border p-2"
                }
            }),

        ]
    },
})