import DragHandle from "@tiptap/extension-drag-handle-react";
import {
  Clipboard,
  Copy,
  GripVertical,
  Link,
  Plus,
  RotateCcw,
  Sparkles,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import { Editor } from "@tiptap/core";
import TooltipWraper from "../TooltipWrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import {
  cn,
  copySelectedNodeToClipboard,
  deleteSelectedNode,
  duplicateSelectedNode,
  setUniversalBlockBackgroundColor,
} from "~/lib/utils";

import { NodeSelection } from "@tiptap/pm/state";

import { Color } from "../color/type";
import Colors from "../color/ColorSubMenu";
import { handleAddRecentUsed } from "../color/utils";

const Dragable = ({ editor }: { editor: Editor | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNodeType, setCurrentNodeType] = useState<string | null>(null);

  if (!editor) {
    return;
  }

  const getNodePosFromHandle = (event: React.MouseEvent) => {
    const dragHandleEl = event.currentTarget.closest(".drag-handle");
    if (!dragHandleEl) return null;
    const rect = dragHandleEl.getBoundingClientRect();
    const xCoords = rect.right + 20;
    const yCoords = rect.top + rect.height / 2;
    return editor.view.posAtCoords({ left: xCoords, top: yCoords });
  };

  const handleInsertAtDragPosition = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const targetPos = getNodePosFromHandle(event);
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

  const handleSelectBlockAndOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const targetPos = getNodePosFromHandle(event);
    if (!targetPos || targetPos.pos === null) return;

    const resolvedPos = editor.state.doc.resolve(targetPos.pos);
    let targetDepth = resolvedPos.depth;

    for (let d = resolvedPos.depth; d > 0; d--) {
      const currentNodeName = resolvedPos.node(d)?.type.name;

      if (
        currentNodeName === "blockquote" ||
        currentNodeName === "bulletList" ||
        currentNodeName === "orderedList" ||
        currentNodeName === "table"
      ) {
        targetDepth = d;
        break;
      }
    }

    const blockStartPos = resolvedPos.before(targetDepth);
    const node = resolvedPos.node(targetDepth);

    if (blockStartPos !== undefined && node && node.type.name !== "doc") {
      const { tr } = editor.state;

      const selection = NodeSelection.create(editor.state.doc, blockStartPos);
      editor.view.dispatch(tr.setSelection(selection));

      setCurrentNodeType(node.type.name);
      console.log("Active Block Node Status:", node.type.name);
      setIsOpen(true);
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

        <div className="relative">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <TooltipWraper
              className="max-w-30 text-center"
              content="Click for options Hold for dragging"
            >
              <Button
                onClick={handleSelectBlockAndOpenMenu}
                variant={"ghost"}
                size={"icon-sm"}
              >
                <GripVertical />
              </Button>
            </TooltipWraper>
            <DropdownMenuTrigger className="sr-only">open</DropdownMenuTrigger>
            <DropdownContent editor={editor} />
          </DropdownMenu>
        </div>
      </div>
    </DragHandle>
  );
};

export default Dragable;

const DropdownContent = ({ editor }: { editor: Editor }) => {
  const handleSetColor = (color: Color) => {
    handleAddRecentUsed(color, () => {});

    if (color.type === "text") {
      editor
        .chain()
        .focus()
        .setColor(`var(--tt-color-text-${color.value})`)
        .run();
      return;
    }
    setUniversalBlockBackgroundColor(
      editor,
      `var(--tt-color-text-${color.value})`,
    );
  };

  return (
    <DropdownMenuContent
      align="center"
      sideOffset={30}
      side="left"
      className="w-55"
    >
      <Colors setColor={handleSetColor} editor={editor} />
      <DropdownMenuItem className={cn("text-muted-foreground")}>
        <RotateCcw /> Reset formatting
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => duplicateSelectedNode(editor)}
        className={cn("text-muted-foreground")}
      >
        <Copy /> Duplicate node
        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => copySelectedNodeToClipboard(editor)}
        className={cn("text-muted-foreground")}
      >
        <Clipboard /> Copy to clipboard
        <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem disabled className={cn("text-muted-foreground")}>
        <Link /> Copy anchor link
        <DropdownMenuShortcut>⌘^L</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled className={cn("text-muted-foreground")}>
        <Sparkles /> Ask AI
        <DropdownMenuShortcut>⌘J</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => deleteSelectedNode(editor)}
        variant="destructive"
      >
        <Trash /> Delete
        <DropdownMenuShortcut>Del</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
