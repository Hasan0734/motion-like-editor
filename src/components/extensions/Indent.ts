import { Extension } from "@tiptap/core";

export interface IndentOptions {
    types: string[]
    minLevel: number
    maxLevel: number
    indentSize: number
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        indent: {
            indent: () => ReturnType
            outdent: () => ReturnType
        }
    }
}

export const Indent = Extension.create({
    name: 'indent',
    addOptions() {
        return {
            types: ['paragraph', 'heading'],
            minLevel: 0,
            maxLevel: 10,
            indentSize: 24
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    // This maps to your CSS [data-indent] selector
                    'data-indent': {
                        default: null,
                        parseHTML: element => element.hasAttribute('data-indent') ? '' : null,
                        renderHTML: attributes => {
                            if (!attributes['data-indent-level'] || attributes['data-indent-level'] <= this.options.minLevel) {
                                return {}
                            }
                            return { 'data-indent': '' }
                        },
                    },
                    // This maps to your CSS --tt-indent-level variable
                    'data-indent-level': {
                        default: 0,
                        parseHTML: element => {
                            const level = element.getAttribute('data-indent-level')
                            return level ? parseInt(level, 10) : 0
                        },
                        renderHTML: attributes => {
                            if (!attributes['data-indent-level'] || attributes['data-indent-level'] <= this.options.minLevel) {
                                return {}
                            }
                            return {
                                'data-indent-level': attributes['data-indent-level'],
                                // Inject the CSS variable inline so your calc() logic picks it up
                                style: `--tt-indent-level: ${attributes['data-indent-level']};`
                            }
                        },
                    },
                },
            },
        ]
    },

    addCommands() {
        const setIndentLevel = (tr: any, dispatch: any, levelUpdate: number) => {
            if (!dispatch) return true

            const { selection } = tr
            const { from, to } = selection
            let isChanged = false

            tr.doc.nodesBetween(from, to, (node: any, pos: number) => {
                if (this.options.types.includes(node.type.name)) {
                    const currentIndent = node.attrs['data-indent-level'] || 0
                    let newIndent = currentIndent + levelUpdate

                    if (newIndent < this.options.minLevel) newIndent = this.options.minLevel
                    if (newIndent > this.options.maxLevel) newIndent = this.options.maxLevel

                    if (newIndent !== currentIndent) {
                        tr.setNodeMarkup(pos, undefined, {
                            ...node.attrs,
                            'data-indent': newIndent > 0 ? '' : null,
                            'data-indent-level': newIndent,
                        })
                        isChanged = true
                    }
                    return false
                }
                return true
            })

            if (isChanged) {
                dispatch(tr)
            }
            return isChanged
        }

        return {
            indent: () => ({ tr, dispatch }) => setIndentLevel(tr, dispatch, 1),
            outdent: () => ({ tr, dispatch }) => setIndentLevel(tr, dispatch, -1),
        }
    },
    addKeyboardShortcuts() {
        return {
            Tab: () => this.editor.commands.indent(),
            'Shift-Tab': () => this.editor.commands.outdent(),
            Backspace: () => {
                const { selection } = this.editor.state;
                const { empty, $anchor } = selection;

                if (!empty) {
                    return false
                }

                if ($anchor.parentOffset !== 0) {
                    return false;
                }

                const currentIndent = $anchor.parent.attrs['data-indent-level'] || 0
                if (currentIndent <= this.options.minLevel) {
                    return false
                }


                return this.editor.commands.outdent()
            }
        }
    },
})