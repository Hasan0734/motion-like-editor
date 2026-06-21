import DragHandle from "@tiptap/extension-drag-handle-react";
import {
  Clipboard,
  Copy,
  GripVertical,
  Link,
  Plus,
  RefreshCw,
  RefreshCwIcon,
  Sparkle,
  Sparkles,
  Trash,
} from "lucide-react";
import { Button } from "./ui/button";
import { Editor } from "@tiptap/core";
import TooltipWraper from "./TooltipWrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { ITEM_CLASSNAME } from "./node/table-node/popover/TableMenuPopover";
import { cn } from "~/lib/utils";
import { ColorsDropdwon } from "./node/table-node/popover/Colors";

const Dragable = ({ editor }: { editor: Editor | null }) => {
  const [isOpen, setIsOpen] = useState(false);

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

        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <TooltipWraper
            className="max-w-30 text-center"
            content="Click for options Hold for dragging"
          >
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="" size={"icon-sm"}>
                <GripVertical />
              </Button>
            </DropdownMenuTrigger>
          </TooltipWraper>
          <DropdownContent editor={editor} />
        </DropdownMenu>
      </div>
    </DragHandle>
  );
};

export default Dragable;

const DropdownContent = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenuContent align="center" side="left" className="w-45">
      <ColorsDropdwon editor={editor} />
      <DropdownMenuItem className={cn("text-muted-foreground")}>
        <RefreshCwIcon /> Reset formatting
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className={cn("text-muted-foreground")}>
        <Copy /> Duplicate node
      </DropdownMenuItem>
      <DropdownMenuItem className={cn("text-muted-foreground")}>
        <Clipboard /> Copy to clipboard
      </DropdownMenuItem>
      <DropdownMenuItem className={cn("text-muted-foreground")}>
        <Link /> Copy anchor link
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className={cn("text-muted-foreground")}>
        <Sparkles /> Ask AI
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <Trash /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
