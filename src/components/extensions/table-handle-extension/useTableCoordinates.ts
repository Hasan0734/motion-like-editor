// useTableCoordinates.ts
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

export function useTableCoordinates(editor: Editor) {
    const [coords, setCoords] = useState<{
        element: HTMLElement | null;
        top: number; left: number; width: number; height: number;
        tableElement: HTMLElement | null;
    } | null>(null);

    useEffect(() => {
        const updateCoordinates = () => {
            const cellData = editor.storage.tableHandle?.hoveredCell;
            if (cellData?.element) {
                const rect = cellData.element.getBoundingClientRect();
                const tableElement = cellData.element.closest('table');
                const editorElement = editor.options.element;
                const editorRect = editorElement.getBoundingClientRect();

                setCoords({
                    element: cellData.element,
                    tableElement,
                    top: rect.top - editorRect.top + editorElement.scrollTop,
                    left: rect.left - editorRect.left + editorElement.scrollLeft,
                    width: rect.width,
                    height: rect.height,
                });
            } else {
                setCoords(null);
            }
        };

        editor.on('transaction', updateCoordinates);
        editor.options.element.addEventListener('mouseover', updateCoordinates);
        return () => {
            editor.off('transaction', updateCoordinates);
        };
    }, [editor]);

    return coords;
}
