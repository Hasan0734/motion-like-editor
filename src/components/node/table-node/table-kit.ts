import { Extension } from '@tiptap/core'
import { TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { CustomTable } from './CustomTable'
import { cn } from '~/lib/utils'
import { Color } from '@tiptap/extension-text-style'

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
            TableHeader.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        background: {
                            default: null,
                            parseHTML: element => element.style.backgroundColor || null,
                            renderHTML: attributes => {
                                if (!attributes.background) return {}
                                return { style: `background-color: ${attributes.background}` }
                            },
                        },
                        alignment: {
                            default: 'left',
                            parseHTML: element => element.style.textAlign || 'left',
                            renderHTML: attributes => {
                                if (!attributes.alignment) return {}
                                return { style: `text-align: ${attributes.alignment}` }
                            },
                        },
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
                        background: {
                            default: null,
                            parseHTML: element => element.style.backgroundColor || null,
                            renderHTML: attributes => {
                                if (!attributes.background) return {}
                                return { style: `background-color: ${attributes.background}` }
                            },
                        },
                        alignment: {
                            default: 'left',
                            parseHTML: element => element.style.textAlign || 'left',
                            renderHTML: attributes => {
                                if (!attributes.alignment) return {}
                                return { style: `text-align: ${attributes.alignment}` }
                            },
                        },
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