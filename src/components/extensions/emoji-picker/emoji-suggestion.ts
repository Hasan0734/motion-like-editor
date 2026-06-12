import { computePosition, flip, shift } from "@floating-ui/react"
import { Editor, posToDOMRect } from "@tiptap/core"
import { ReactRenderer } from "@tiptap/react"
import { SuggestionOptions } from "@tiptap/suggestion"
import ListOfEmoji from "./EmojiPicker"

const updatePosition = (editor: Editor, element: HTMLElement) => {
    const virtualElement = {
        getBoundingClientRect: () =>
            posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
    }

    computePosition(virtualElement, element, {
        placement: 'bottom-start',
        strategy: 'absolute',
        middleware: [shift(), flip()],
    }).then(({ x, y, strategy }) => {
        element.style.width = 'max-content'
        element.style.position = strategy
        element.style.left = `${x}px`
        element.style.top = `${y}px`
    })
}


export default <Omit<SuggestionOptions, 'editor'>>{
    items: ({ editor, query }) => {
        return editor.storage.emoji.emojis.filter(({ shortcodes, tags }) => {
            return (
                shortcodes.find(shortcode => shortcode.startsWith(query.toLowerCase())) ||
                tags.find(tag => tag.startsWith(query.toLowerCase()))
            )
        })
    },
    allow: ({ editor }) => {
        const isInsideHTMLCodeBlock = editor.isActive('htmlCodeBlock');
        if (isInsideHTMLCodeBlock) {
            return false;
        }

        return true;
    },
    render: () => {
        let component: ReactRenderer<any>;
        return {
            onStart: (props) => {
                component = new ReactRenderer(ListOfEmoji, {
                    props,
                    editor: props.editor,
                });
                if (!props.clientRect) {
                    return
                }

                component.element.style.position = 'absolute'
                document.body.appendChild(component.element)
                updatePosition(props.editor, component.element)
            },
            onUpdate(props) {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                updatePosition(props.editor, component.element)
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    component.destroy()
                    component.element.remove()

                    return true
                }

                return component.ref?.onKeyDown(props)
            },

            onExit() {
                component.destroy()
                component.element.remove()
            },
        }
    }
}