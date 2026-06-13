import { Editor, posToDOMRect } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import { SuggestionOptions } from "@tiptap/suggestion";
import { autoUpdate, computePosition, flip, shift } from "@floating-ui/react"


import { blockItems } from "./items";
import SlashMenu from "./SlashMenu";


const updatePosition = (editor: Editor, element: HTMLElement) => {
    const virtualElement = {
        getBoundingClientRect: () =>
            posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
    };

    computePosition(virtualElement, element, {
        placement: 'bottom-start',
        strategy: 'absolute',
        middleware: [shift(), flip()],
    }).then(({ x, y, strategy }) => {
        element.style.width = 'max-content';
        element.style.position = strategy;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    });
};



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
        let cleanup: (() => void) | undefined;
        return {
            onStart: (props) => {
                component = new ReactRenderer(SlashMenu, {
                    props,
                    editor: props.editor,
                    className: "not-prose"

                });

                if (!props.clientRect) {
                    return;
                }

                component.element.style.position = 'absolute';
                const contentBody = document.querySelector(".notion-like-editor-content");
                contentBody?.appendChild(component.element)
                // document.body.appendChild(component.element);

                const referenceElement = props.editor.view.dom;
                const floatingElement = component.element;

                cleanup = autoUpdate(referenceElement, floatingElement, () => {
                    updatePosition(props.editor, floatingElement);
                });
            },
            onUpdate(props) {
                component.updateProps(props)
                console.log(props)

                if (!props.clientRect) {
                    return
                }

                updatePosition(props.editor, component.element)
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    cleanup?.();
                    component.destroy();
                    component.element.remove();
                    return true;
                }

                return component.ref?.onKeyDown(props)
            },

            onExit() {
                cleanup?.();
                component.destroy();
                component.element.remove();
            },
        }
    }
}