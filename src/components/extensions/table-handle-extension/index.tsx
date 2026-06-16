// TableHandle.tsx
import React from "react";
import { Editor } from "@tiptap/react";
import { useTableCoordinates } from "./useTableCoordinates";

export const TableHandle: React.FC<{ editor: Editor | null }> = ({
  editor,
}) => {
  if (!editor) return;

  const coords = useTableCoordinates(editor);
  if (!coords) return null;

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{ top: 0, left: 0 }}
    >
      {/* Column Handle */}
      <button
        type="button"
        className="absolute pointer-events-auto flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 shadow-sm rounded text-slate-500 cursor-pointer text-xs"
        style={{
          top: `${coords.top - 22}px`,
          left: `${coords.left + coords.width / 2 - 12}px`,
          width: "24px",
          height: "18px",
        }}
        onClick={() => {
          const pos = editor.storage.tableHandle?.hoveredCell?.pos;
          if (pos) editor.commands.focus(pos);
        }}
      >
        ⋮
      </button>

      {/* Row Handle */}
      <button
        type="button"
        className="absolute pointer-events-auto flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 shadow-sm rounded text-slate-500 cursor-pointer text-xs"
        style={{
          top: `${coords.top + coords.height / 2 - 12}px`,
          left: `${coords.left - 26}px`,
          width: "18px",
          height: "24px",
        }}
        onClick={() => {
          const pos = editor.storage.tableHandle?.hoveredCell?.pos;
          if (pos) editor.commands.focus(pos);
        }}
      >
        ⋯
      </button>
    </div>
  );
};
