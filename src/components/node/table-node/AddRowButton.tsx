import { Plus } from "lucide-react";
import { Editor } from "@tiptap/react";
import { Fragment } from "@tiptap/pm/model";

export function AddRowButton({ editor }: { editor: Editor }) {
  return (
    <button
      className="w-full bg-accent flex justify-center items-center rounded-full mt-1"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const container = e.currentTarget.parentElement;
        const tablePosAttr = container?.getAttribute("data-table-pos");

        if (tablePosAttr) {
          const tablePos = parseInt(tablePosAttr, 10);
          const { state, view } = editor;
          const { tr, schema } = state;

          const $pos = state.doc.resolve(tablePos);
          const tableNode = state.doc.nodeAt(tablePos);

          if (tableNode && tableNode.type.name === "table") {
            const firstRow = tableNode.firstChild;
            if (!firstRow) return;

            const colCount = firstRow.childCount;
            const cellType = schema.nodes.tableCell;

            const cells = [];
            for (let i = 0; i < colCount; i++) {
              cells.push(cellType.createAndFill());
            }

            const validCells = cells.filter(
              (cell): cell is NonNullable<typeof cell> => cell !== null,
            );

            const newRow = schema.nodes.tableRow.create(
              null,
              Fragment.from(validCells),
            );

            const insertPos = tablePos + tableNode.nodeSize - 1;

            tr.insert(insertPos, newRow);
            view.dispatch(tr);
          }
        }
      }}
    >
      <Plus size={14} />
    </button>
  );
}
