import { Editor } from "@tiptap/core";
import { ResolvedPos } from "@tiptap/pm/model";
import {
    moveTableRow,
    TableMap,
} from "@tiptap/pm/tables";



// Extend the native CellSelection interface types since Tiptap wraps ProseMirror
interface CellSelection extends Selection {
    $anchor: any;
    anchorCell?: ResolvedPos;
}


/**
 * Shifts the currently selected or focused table row vertically up or down.
 *
 * @param editor The active Tiptap Editor instance.
 * @param direction The vertical vector path ('up' | 'down').
 * @returns boolean indicating if the command was successfully validated and executed.
 */
export const moveActiveRow = (
    editor: Editor,
    direction: "up" | "down",
): boolean => {
    return editor
        .chain()
        .focus()
        .command(({ state, dispatch }) => {
            const selection = state.selection as unknown as CellSelection;
            let cellPos: number | null = null;

            // 1. Target the correct cell position context
            if (selection.anchorCell) {
                cellPos = selection.anchorCell.pos;
            } else {
                const $pos = selection.$anchor;
                for (let d = $pos.depth; d > 0; d--) {
                    const nodeName = $pos.node(d).type.name;
                    if (nodeName === "tableCell" || nodeName === "tableHeader") {
                        cellPos = $pos.before(d);
                        break;
                    }
                }
            }

            if (cellPos === null) return false;

            // 2. Resolve structural context up to the parent Table Node
            const $cellPos = state.doc.resolve(cellPos);
            let tableNode = null;
            let tablePos = -1;

            for (let d = $cellPos.depth; d > 0; d--) {
                if ($cellPos.node(d).type.name === "table") {
                    tableNode = $cellPos.node(d);
                    tablePos = $cellPos.before(d);
                    break;
                }
            }

            if (!tableNode || tablePos === -1) return false;

            // 3. Map structural grid architecture using TableMap
            const map = TableMap.get(tableNode);
            const localCellPos = cellPos - tablePos - 1;

            // 4. Safely extract zero-indexed row from Rect properties
            // (Bypasses rowCount limitations when handling complex spans)
            const cellRect = map.findCell(localCellPos);
            const currentRowIndex = cellRect.top;

            // 5. Calculate target index based on intent
            const targetRowIndex =
                direction === "up" ? currentRowIndex - 1 : currentRowIndex + 1;

            // 6. Enforce boundaries checking against total matrix height
            if (targetRowIndex >= 0 && targetRowIndex < map.height) {
                if (dispatch) {
                    const commandAction = moveTableRow({
                        from: currentRowIndex,
                        to: targetRowIndex,
                    });
                    return commandAction(state, dispatch);
                }
                return true;
            }

            return false;
        })
        .run();
};
