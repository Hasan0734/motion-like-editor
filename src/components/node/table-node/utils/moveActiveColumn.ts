import { Editor } from "@tiptap/core";
import { ResolvedPos } from "@tiptap/pm/model";
import {
    moveTableColumn,
    TableMap,
} from "@tiptap/pm/tables";




// Extend the native CellSelection interface types since Tiptap wraps ProseMirror
interface CellSelection extends Selection {
    $anchor: any;
    anchorCell?: ResolvedPos;
}

/**
 * Moves the currently selected table column left or right.
 * @param editor The Tiptap Editor instance
 * @param direction The direction to move the column ('left' | 'right')
 * @returns boolean indicating if the command was successfully executed
 */
export const moveActiveColumn = (
    editor: Editor,
    direction: "left" | "right",
): boolean => {
    return editor
        .chain()
        .focus()
        .command(({ state, dispatch }) => {
            const selection = state.selection as unknown as CellSelection;
            let cellPos: number | null = null;

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

            const map = TableMap.get(tableNode);
            const localCellPos = cellPos - tablePos - 1;

            const currentColumnIndex = map.colCount(localCellPos);

            const targetColumnIndex =
                direction === "left" ? currentColumnIndex - 1 : currentColumnIndex + 1;

            if (targetColumnIndex >= 0 && targetColumnIndex < map.width) {
                if (dispatch) {
                    const commandAction = moveTableColumn({
                        from: currentColumnIndex,
                        to: targetColumnIndex,
                    });
                    return commandAction(state, dispatch);
                }
                return true;
            }

            return false;
        })
        .run();
};

