import DragHandle from "@tiptap/extension-drag-handle-react";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Editor } from "@tiptap/core";
import TooltipWraper from "./TooltipWrapper";

const Dragable = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return;
  }

  const handleInsertAtDragPosition = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const dragHandleEl = event.currentTarget.closest(".drag-handle");
    if (!dragHandleEl) return;
    const rect = dragHandleEl.getBoundingClientRect();
    const xCoords = rect.right + 20;
    const yCoords = rect.top + rect.height / 2;
    const targetPos = editor.view.posAtCoords({ left: xCoords, top: yCoords });
    if (targetPos && targetPos.pos !== null) {
      const resolvedPos = editor.state.doc.resolve(targetPos.pos);
      const startOfBlock = resolvedPos.end(resolvedPos.depth);
      editor
        .chain()
        .insertContentAt(startOfBlock, {
          type: "paragraph",
          content: [{ type: "text", text: "/" }],
        })
        .focus()
        .run();
    }
  };

  return (
    <DragHandle
      className="drag-handle"
      editor={editor}
      nested={false}
      computePositionConfig={{
        placement: "left-start",
        strategy: "absolute",
      }}
    >
      <div className="flex items-center gap-1 mr-2  ">
        <TooltipWraper content="Insert block">
          <Button
            onClick={handleInsertAtDragPosition}
            variant={"ghost"}
            className=""
            size={"icon-sm"}
          >
            <Plus />
          </Button>
        </TooltipWraper>

        <TooltipWraper
          className="max-w-30 text-center"
          content="Click for options Hold for dragging"
        >
          <Button variant={"ghost"} className="" size={"icon-sm"}>
            <GripVertical />
          </Button>
        </TooltipWraper>
      </div>
    </DragHandle>
  );
};

export default Dragable;
