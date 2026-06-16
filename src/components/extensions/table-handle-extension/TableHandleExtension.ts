// TableHandleExtension.ts
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface TableHandleStorage {
    hoveredCell: {
        element: HTMLElement | null;
        pos: number | null;
        rowIndex: number | null;
        colIndex: number | null;
    };
}

// 1. Tell TypeScript that 'tableHandle' exists on editor.storage
declare module '@tiptap/core' {
    interface Storage {
        tableHandle: TableHandleStorage;
    }
}

export const TableHandleExtension = Extension.create<any, TableHandleStorage>({
    name: 'tableHandle',

    addStorage() {
        return {
            hoveredCell: {
                element: null,
                pos: null,
                rowIndex: null,
                colIndex: null,
            },
        };
    },

    addProseMirrorPlugins() {
        const extensionThis = this;

        return [
            new Plugin({
                key: new PluginKey('tableHandlePlugin'),
                props: {
                    handleDOMEvents: {
                        mouseover(view, event) {
                            const target = event.target as HTMLElement;
                            const cell = target.closest('td, th') as HTMLElement;

                            if (!cell) {
                                extensionThis.storage.hoveredCell = { element: null, pos: null, rowIndex: null, colIndex: null };
                                return false;
                            }

                            const pos = view.posAtDOM(cell, 0);
                            if (pos < 0) return false;

                            const row = cell.closest('tr');
                            const table = cell.closest('table');

                            if (row && table) {
                                const rowIndex = Array.from(table.rows).indexOf(row);
                                const colIndex = Array.from(row.cells).indexOf(cell as HTMLTableCellElement);

                                extensionThis.storage.hoveredCell = {
                                    element: cell,
                                    pos,
                                    rowIndex,
                                    colIndex,
                                };
                            }
                            return false;
                        },
                    },
                },
            }),
        ];
    },
});
