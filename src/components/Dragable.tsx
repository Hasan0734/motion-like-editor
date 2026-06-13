import DragHandle from "@tiptap/extension-drag-handle-react";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Editor, NodePos } from "@tiptap/core";
import TooltipWraper from "./TooltipWraper";
import { act, useState } from "react";

const Dragable = ({ editor }: { editor: Editor | null }) => {
  const [activeNodePos, setActiveNodePos] = useState<any | null>(null);
  if (!editor) {
    return;
  }

  const handleInsertOnNewLine = () => {
    if (!editor) return;
    if (!editor || activeNodePos === null) return;
    editor
      .chain()
      .focus()
      .setNodeSelection(activeNodePos)
      .createParagraphNear()
      .insertContent("/")
      .run();
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
      onNodeChange={({ node, pos }) => {
        setActiveNodePos(pos);
      }}
    >
      <div className="flex items-center gap-1 mr-2  ">
        <TooltipWraper content="Insert block">
          <Button
            onClick={handleInsertOnNewLine}
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
