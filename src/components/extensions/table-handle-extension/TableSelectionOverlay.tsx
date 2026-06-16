// TableSelectionOverlay.tsx
import React from 'react';
import { Editor } from '@tiptap/react';
import { useTableCoordinates } from './useTableCoordinates';

interface OverlayProps {
  editor: Editor;
  showResizeHandles?: boolean;
  cellMenu?: (props: { editor: Editor; onResizeStart?: (direction: string) => (e: React.MouseEvent) => void }) => React.ReactNode;
}

export const TableSelectionOverlay: React.FC<OverlayProps> = ({ editor, showResizeHandles, cellMenu }) => {
  const coords = useTableCoordinates(editor);
  if (!coords) return null;

  const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    // Native tiptap columns handles column resizing natively via tracking logic. 
    // You can hook custom layout logic here if desired.
  };

  return (
    <div 
      className="absolute border-2 border-indigo-500 bg-indigo-500/5 pointer-events-none z-20"
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        height: `${coords.height}px`,
      }}
    >
      {/* Dropdown Menu Container Injection */}
      {cellMenu && (
        <div className="absolute top-1 right-1 pointer-events-auto">
          {cellMenu({ editor, onResizeStart: handleResizeStart })}
        </div>
      )}

      {/* Bottom Right Resize Handle Anchor Accent */}
      {showResizeHandles && (
        <div 
          className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-600 cursor-se-resize pointer-events-auto transform translate-x-1 translate-y-1 rounded-sm shadow-sm"
          onMouseDown={handleResizeStart('br')}
        />
      )}
    </div>
  );
};

// TableCellHandleMenu.tsx
export const TableCellHandleMenu: React.FC<{ editor: Editor; onMouseDown?: (e: React.MouseEvent) => void }> = ({ editor }) => {
  return (
    <div className="flex bg-white shadow border border-slate-200 rounded p-0.5 space-x-0.5 text-xs text-slate-600">
      <button 
        type="button"
        onClick={() => editor.commands.deleteRow()}
        className="px-1.5 py-0.5 hover:bg-red-50 hover:text-red-600 rounded transition"
        title="Delete Row"
      >
        − Row
      </button>
      <button 
        type="button"
        onClick={() => editor.commands.deleteColumn()}
        className="px-1.5 py-0.5 hover:bg-red-50 hover:text-red-600 rounded transition"
        title="Delete Column"
      >
        − Col
      </button>
    </div>
  );
};
