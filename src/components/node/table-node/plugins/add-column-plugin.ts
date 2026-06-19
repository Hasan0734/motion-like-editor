import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";
import { TableControlState } from "./plugin-keys";

export interface TableAddColumnPluginProps {
    editor: Editor;
    element: HTMLElement;
    pluginKey: PluginKey<TableControlState>;
}

export function TableAddColumnPlugin({
    editor,
    element,
    pluginKey,
}: TableAddColumnPluginProps) {
    const setVisibility = (opacity: "0" | "1") => {
        element.style.transition = "opacity 0.2s ease";
        element.style.opacity = opacity;
    };

    return new Plugin<TableControlState>({
        key: pluginKey,

        props: {
            handleDOMEvents: {
                mouseover(view, event) {
                    const target = event.target as HTMLElement;

                    const insideControls = target.closest(".table-controls");

                    const lastColumnCell = target.closest(
                        "table tr td:last-child, table tr th:last-child"
                    );

                    if (insideControls || lastColumnCell) {
                        const tableWrapper = target.closest(".tableWrapper");

                        const tableElement =
                            tableWrapper?.querySelector("table") ?? null;


                        console.log(tableElement?.offsetHeight)

                        const controls =
                            tableWrapper?.querySelector(".table-controls") as HTMLElement | null;

                        if (controls && tableElement) {
                            const pos = view.posAtDOM(tableElement, 0);

                            element.setAttribute(
                                "data-table-pos",
                                String(pos - 1)
                            );

                            if (!controls.contains(element)) {
                                controls.appendChild(element);
                            }

                            // Position on right side
                            element.style.height = `${tableElement?.offsetHeight}px`
                            element.style.position = "absolute";
                            element.style.top = "45%";
                            element.style.left = `${tableElement.offsetWidth + 18}px`;
                            element.style.transform = "translateY(-50%)";

                            setVisibility("1");
                            return false;
                        }
                    }

                    setVisibility("0");
                    return false;
                },

                mouseleave() {
                    setVisibility("0");
                    return false;
                },
            },
        },

        view() {
            element.style.opacity = "1";
            element.style.visibility = "visible";

            return {
                destroy() {
                    element.remove();
                },
            };
        },
    });
}