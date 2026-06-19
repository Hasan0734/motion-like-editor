import {
    computePosition,
    offset,
} from "@floating-ui/dom";

import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Editor, findParentNodeClosestToPos } from "@tiptap/react";
import { addColumnPluginKey, TableControlState } from "./plugin-keys";
import { FloatingUIOptionsProps } from "./table-menu-handle-plugin";
import { EditorView } from "@tiptap/pm/view";


export interface AddColumnPluginProps {
    editor: Editor;
    element: HTMLElement;
    pluginKey: PluginKey<TableControlState>;
}

export function AddColumnPlugin({
    editor,
    element,
    pluginKey,
}: AddColumnPluginProps) {

    // Quick helper to safely set opacity transitions
    const setVisibility = (opacity: "0" | "1") => {
        element.style.transition = "opacity 0.2s ease"; // Smooth fading
        element.style.opacity = opacity;
    };


    return new Plugin<TableControlState>({
        key: pluginKey,
        props: {
            handleDOMEvents: {
                mouseover(view, event) {
                    const target = event.target as HTMLElement;

                    const insideControls = target.closest(".table-controls");
                    const lastRow = target.closest("table tr:last-child");


                    if (insideControls || lastRow) {
                        // Find the master wrapper to locate/move our button if necessary
                        const tableWrapper = target.closest(".tableWrapper");
                        const tableElement = tableWrapper?.querySelector("table");
                        const controls = tableWrapper?.querySelector(".table-controls") as HTMLElement | null;

                        if (controls && tableElement) {
                            const pos = view.posAtDOM(tableElement, 0);

                            element.setAttribute("data-table-pos", String(pos - 1));

                            if (!controls.contains(element)) {
                                element.style.position = "";
                                controls.appendChild(element);
                            }
                            setVisibility("1");
                            return false;
                        }
                    }
                    setVisibility("0");
                    return false;
                },

                mouseleave(view, event) {
                    // Fade it out completely when mouse leaves the editor view canvas
                    setVisibility("0");
                    return false;
                }
            }
        },
        view() {
            // Initial state is hidden until a hover happens
            element.style.opacity = "0";
            element.style.visibility = 'visible';
            element.style.right = '0'

            return {
                destroy() {
                    element.remove();
                },
            };
        },
    });
}