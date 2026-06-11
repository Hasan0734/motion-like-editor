import { Editor, posToDOMRect } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import { computePosition, flip, shift } from "@floating-ui/react"
import CommandList from "./command-list";
import {
    blockquote,
    heading1,
    heading2,
    heading3,
    text,
} from "../blocks/typography";
import { bulletList, orderedList, taskList } from "../blocks/list";
import { htmlCodeBlock } from "../blocks/code";
import { table } from "../blocks/table";
import { mention } from "../blocks/mention";
import { emoji } from "../blocks/emoji";
import { separator } from "../blocks/separator";
import { tableOfContents } from "../blocks/tableOfContents";


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

export const blockItems = [
    {
        title: "AI",
        commands: [
            heading3,
            bulletList,
            orderedList,
            blockquote,
            htmlCodeBlock
        ]
    },
    {
        title: "Style",
        commands: [
            text,
            heading1,
            heading2,
            heading3,
            bulletList,
            orderedList,
            taskList,
            blockquote,
            htmlCodeBlock
        ]
    },
    {
        title: "Insert",
        commands: [
            mention,
            emoji,
            table,
            separator,
            tableOfContents
        ]
    },
    {
        title: "Upload",
        commands: [
            heading3,
            bulletList,

        ]
    }
]

export default <Omit<SuggestionOptions, 'editor'>>{
    items: ({ query }) => {
        return blockItems
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
                component = new ReactRenderer(CommandList, {
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