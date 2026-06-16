// TableExtendRowColumnButtons.tsx
import React from 'react';
import { Editor } from '@tiptap/react';
import { useTableCoordinates } from './useTableCoordinates';

export const TableExtendRowColumnButtons: React.FC<{ editor: Editor }> = ({ editor }) => {
  const coords = useTableCoordinates(editor);
  if (!coords || !coords.tableElement) return null;

  const tableRect = coords.tableElement.getBoundingClientRect();
  const editorRect = editor.options.element.getBoundingClientRect();
  
  // Calculate full dimensions of the containing table block
  const tableTop = tableRect.top - editorRect.top + editor.options.element.scrollTop;
  const tableLeft = tableRect.left - editorRect.left + editor.options.element.scrollLeft;

  return (
    <div className="absolute pointer-events-none z-20" style={{ top: 0, left: 0 }}>
      {/* Extend Column Button (+ Right) */}
      <button
        type="button"
        className="absolute pointer-events-auto flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold border border-indigo-200 rounded-full shadow-sm"
        style={{
          top: `${tableTop + tableRect.height / 2 - 10}px`,
          left: `${tableLeft + tableRect.width + 8}px`,
          width: '20px',
          height: '20px',
        }}
        onClick={() => {
          const pos = editor.storage.tableHandle?.hoveredCell?.pos;
          if (pos) {
            editor.commands.focus(pos);
            editor.commands.addColumnAfter();
          }
        }}
        title="Add Column"
      >
        +
      </button>

      {/* Extend Row Button (+ Bottom) */}
      <button
        type="button"
        className="absolute pointer-events-auto flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold border border-indigo-200 rounded-full shadow-sm"
        style={{
          top: `${tableTop + tableRect.height + 8}px`,
          left: `${tableLeft + tableRect.width / 2 - 10}px`,
          width: '20px',
          height: '20px',
        }}
        onClick={() => {
          const pos = editor.storage.tableHandle?.hoveredCell?.pos;
          if (pos) {
            editor.commands.focus(pos);
            editor.commands.addRowAfter();
          }
        }}
        title="Add Row"
      >
        +
      </button>
    </div>
  );
};
