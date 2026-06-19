import { Plus } from "lucide-react";
import { Editor } from "@tiptap/react";
import { useRef } from "react";
import { deleteEmptyColumnFromRight, insertColumnAtRight } from "./utils/table";

export function AddColumnButton({ editor }: { editor: Editor }) {
  const dragMetrics = useRef({
    isDragging: false,
    startX: 0,
    colWidth: 0,
    tablePos: 0,
    colsTracked: 0,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Read the table position from the injected container attribute
    const container = e.currentTarget.parentElement;
    const tablePosAttr = container?.getAttribute("data-table-pos");
    if (!tablePosAttr) return;
    
    const tablePos = parseInt(tablePosAttr, 10);

    // 2. Locate the table DOM via the editor's ProseMirror view directly
    const tableElement = editor.view.nodeDOM(tablePos) as HTMLElement | null;
    if (!tableElement) return;

    // 3. Target the last cell of the first row safely within this table scope
    const lastCellElement = tableElement.querySelector(
      "tr:first-child > *:last-child",
    );
    if (!lastCellElement) return;

    dragMetrics.current = {
      isDragging: true,
      startX: e.clientX,
      colWidth: lastCellElement.getBoundingClientRect().width,
      tablePos: tablePos,
      colsTracked: 0,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const metrics = dragMetrics.current;
    if (!metrics.isDragging) return;

    const deltaX = e.clientX - metrics.startX;
    // Positive deltaX means moving right (Add), negative means moving left (Remove)
    const targetColChange = Math.round(deltaX / metrics.colWidth);

    if (targetColChange === metrics.colsTracked) return;

    if (targetColChange > metrics.colsTracked) {
      const success = insertColumnAtRight(editor, metrics.tablePos, false);
      if (success) metrics.colsTracked += 1;
    } else if (targetColChange < metrics.colsTracked) {
      const success = deleteEmptyColumnFromRight(
        editor,
        metrics.tablePos,
        false,
      );
      if (success) metrics.colsTracked -= 1;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    const metrics = dragMetrics.current;
    if (!metrics.isDragging) return;

    const totalDeltaX = Math.abs(e.clientX - metrics.startX);

    // Standard single click fallback loop (< 4px mouse motion)
    if (totalDeltaX < 4) {
      insertColumnAtRight(editor, metrics.tablePos, true);
    } else {
      // Commit the drag steps cleanly into history
      editor.view.dispatch(editor.state.tr.setMeta("addToHistory", true));
    }

    metrics.isDragging = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <button
      className="h-full w-3 bg-accent flex justify-center items-center rounded-full ml-1 cursor-ew-resize selection:bg-transparent transition-colors hover:bg-accent/80"
      onMouseDown={handleMouseDown}
    >
      <Plus size={12} />
    </button>
  );
}