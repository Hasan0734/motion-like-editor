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
    options?: FloatingUIOptionsProps
}

export function AddColumnPlugin({
    editor,
    element,
    pluginKey,
    options
}: AddColumnPluginProps) {

    const floatingUIOptions: NonNullable<FloatingUIOptionsProps> = options ?? {
        strategy: "absolute",
        placement: "top",
        offset: 0,
        flip: {},
        shift: {},
        arrow: false,
        size: false,
        autoPlacement: false,
        hide: false,
        inline: false,
    };

    let visible = false;

    let ticking = false;
    let currentTablePos: number | undefined;
    let currentCellPos: number | undefined;

    const showMenu = (_view: EditorView, root: HTMLElement | null) => {
        if (visible) {
            return;
        }

        element.style.visibility = "visible";
        element.style.opacity = "1";
        // attach to editor's parent element
        root?.appendChild(element);
        // view.dom.parentElement?.appendChild(element);

        floatingUIOptions.onShow?.();

        visible = true;
    };


    const hide = () => {
        if (!visible) return;

        element.remove();

        element.style.opacity = "0";
        element.style.visibility = "hidden";

        floatingUIOptions.onHide?.();
        visible = false;

    };

    const updatePosition = async (
        view: EditorView, rect: DOMRect,
    ) => {

        const pluginState = pluginKey.getState(view.state);
        if (pluginState?.visible) {
            return;
        }
        // const firstRow =
        //     table.querySelector("tr");

        // if (!firstRow) return;

        // const lastCell =
        //     firstRow.lastElementChild;

        // if (!lastCell) return;

        // const cellRect =
        //     lastCell.getBoundingClientRect();

        // const tableRect =
        //     table.getBoundingClientRect();

        const virtualElement = {
            getBoundingClientRect: () => rect,
            getClientRects: () => [rect],
        };



        const { x, y } =
            await computePosition(
                virtualElement,
                element,
                {
                    placement: "right",
                    middleware: [
                        offset(6),
                    ],
                }
            );

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.position = "absolute";

        if (visible) {
            floatingUIOptions.onUpdate?.()
        }
    };


    const handleMouseMove = (view: EditorView, evt: MouseEvent) => {
        const target = evt.target as Element;
        if (!target) {
            return;
        }


        const pluginState = pluginKey.getState(view.state);
        if (pluginState?.visible) {
            return;
        }

        const pos = view.posAtDOM(target, 0);

        if (pos === undefined) {
            return;
        }
        let tableNodePos: number | undefined = undefined;
        let cellNodePos: number | undefined = undefined;



        if (tableNodePos === undefined) {
            hide();
            return;
        }

        if (currentTablePos !== tableNodePos) {
            hide();
        }
        if (cellNodePos === undefined) {
            return;
        }

        if (currentCellPos === cellNodePos) {
            return;
        }




        const tableCell = view.nodeDOM(cellNodePos);
        if (!tableCell || !(tableCell instanceof HTMLTableCellElement)) {
            return;
        }
        const tableCellRect = tableCell.getBoundingClientRect();

        currentTablePos = tableNodePos;



        const tableRoot = view.nodeDOM(tableNodePos);
        if (!tableRoot || !(tableRoot instanceof HTMLDivElement)) {
            hide();
            return;
        }
        // console.log(TableMap.get(view.state.doc.nodeAt(tableNodePos)!));

        const table = tableRoot.querySelector("table");
        if (!table) {
            return;
        }

        const tableRect = table.getBoundingClientRect();
        const offset = 16;

        tableCellRect.y = tableRect.y;

    }
    return new Plugin({
        key: addColumnPluginKey,
        state: {
            init: () => {
                return {
                    visible: false
                }
            },
            apply: (tr, vlaue) => {
                const meta = tr.getMeta(addColumnPluginKey)

                console.log(meta)
                return vlaue;
            }
        },
        view() {
            return {
                update: (view, prevState) => {
                    const prevPluginState = pluginKey.getState(prevState);
                    const pluginState = pluginKey.getState(view.state);

                    if (currentCellPos === undefined) {
                        hide();
                        return;
                    }

                    const tableNode = findParentNodeClosestToPos(
                        view.state.doc.resolve(currentCellPos),
                        (n) => {
                            return n.type.name === "table";
                        }
                    );
                    if (!tableNode) {
                        hide();
                        return;
                    }
                    const tableCell = view.nodeDOM(currentCellPos);
                    const tableRoot = view.nodeDOM(tableNode.pos);


                    if (!tableRoot || !(tableRoot instanceof HTMLDivElement)) {
                        hide();
                        return;
                    }

                    if (!tableCell || !(tableCell instanceof HTMLTableCellElement)) {
                        hide();
                        return;
                    }

                    const table = tableRoot.querySelector("table");
                    if (!table) {
                        return;
                    }


                    const tableRect = table.getBoundingClientRect();
                    const tableCellRect = tableCell.getBoundingClientRect();

                    tableCellRect.x = tableRect.x;
                    updatePosition(view, tableCellRect);
                },
                destroy() {
                    hide();
                    floatingUIOptions.onDestroy?.();
                },
            };
        },
        props: {
            handleDOMEvents: {
                mousemove(view, event) {

                    if (!ticking) {
                        window.requestAnimationFrame(() => {
                            handleMouseMove(view, event);
                            ticking = false;
                        });
                        ticking = true;
                    }

                    // console.log({event})
                    // if (!editor.isActive("table")) {
                    //     hide();
                    //     return false;
                    // }

                    // const target =
                    //     event.target as HTMLElement;

                    // const td =
                    //     target.closest("td,th");

                    // if (!td) {
                    //     hide();
                    //     return false;
                    // }

                    // const table =
                    //     td.closest("table");

                    // if (!table) {
                    //     hide();
                    //     return false;
                    // }

                    // const firstRow =
                    //     table.querySelector("tr");

                    // const lastCell =
                    //     firstRow?.lastElementChild;

                    // if (!lastCell) {
                    //     hide();
                    //     return false;
                    // }

                    // if (td !== lastCell) {
                    //     hide();
                    //     return false;
                    // }

                    // const rect =
                    //     lastCell.getBoundingClientRect();

                    // const hoverZone = 16;

                    // const isRightHover =
                    //     event.clientX >
                    //     rect.right - hoverZone;

                    // if (!isRightHover) {
                    //     hide();
                    //     return false;
                    // }

                    // updatePosition(table);

                    // const root =
                    //     table.parentElement;

                    // if (root) {
                    //     // showMenu(root);
                    //     console.log(root)
                    // }

                    // return false;
                },
                mousedown: handleMouseMove
            },
        },


    });
}