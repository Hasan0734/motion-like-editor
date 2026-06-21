import React, { useRef } from "react";
import { Plus } from "lucide-react";
import { Editor } from "@tiptap/react";
import { deleteEmptyRowFromBottom, insertRowAtBottom } from "./utils/table";

export function AddRowButton({ editor }: { editor: Editor }) {
  const dragMetrics = useRef({
    isDragging: false,
    startY: 0,
    rowHeight: 0,
    tablePos: 0,
    rowsTracked: 0,
  });
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const container = e.currentTarget.parentElement;
    const tablePosAttr = container?.getAttribute("data-table-pos");
    const tableElement = container
      ?.closest(".table-wrapper")
      ?.querySelector("table");
    const lastRowElement = tableElement?.querySelector("tr:last-child");

    if (!tablePosAttr || !lastRowElement) return;

    dragMetrics.current = {
      isDragging: true,
      startY: e.clientY,
      rowHeight: lastRowElement.getBoundingClientRect().height,
      tablePos: parseInt(tablePosAttr, 10),
      rowsTracked: 0,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const metrics = dragMetrics.current;
    if (!metrics.isDragging) return;

    const deltaY = e.clientY - metrics.startY;
    const targetRowChange = Math.round(deltaY / metrics.rowHeight);

    if (targetRowChange === metrics.rowsTracked) return;

    // Dragging Down -> Add Row
    if (targetRowChange > metrics.rowsTracked) {
      const success = insertRowAtBottom(editor, metrics.tablePos, false);
      if (success) metrics.rowsTracked += 1;
    }
    // Dragging Up -> Delete Empty Row
    else if (targetRowChange < metrics.rowsTracked) {
      const success = deleteEmptyRowFromBottom(editor, metrics.tablePos, false);
      if (success) metrics.rowsTracked -= 1;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    const metrics = dragMetrics.current;
    const totalDeltaY = Math.abs(e.clientY - metrics.startY);

    if (totalDeltaY < 4) {
      insertRowAtBottom(editor, metrics.tablePos, true);
    } else {
      // Commit the final drag outcome macro safely to history
      editor.view.dispatch(editor.state.tr.setMeta("addToHistory", true));
    }

    metrics.isDragging = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
  return (
    <button
      className="w-full h-3 bg-accent flex justify-center items-center rounded-full mt-1 cursor-ns-resize selection:bg-transparent"
      onMouseDown={handleMouseDown}
    >
      <Plus size={12} />
    </button>
  );
}
