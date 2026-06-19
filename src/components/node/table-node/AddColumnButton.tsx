import { Plus } from "lucide-react";
import { Editor } from "@tiptap/react";

export function AddColumnButton({
  editor,
}: {
  editor: Editor;
}) {
  return (
    <button
      className="table-add-column"
      onMouseDown={(e) => {
        e.preventDefault();

        editor
          .chain()
          .focus()
          .addColumnAfter()
          .run();
      }}
    >
      <Plus size={14} />
    </button>
  );
}