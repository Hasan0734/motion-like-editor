import React, { useState } from "react";
import TooltipWraper from "./TooltipWraper";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  EllipsisVertical,
  ListIndentDecrease,
  ListIndentIncrease,
  Subscript,
  Superscript,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
} from "lucide-react";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { Separator } from "./ui/separator";
import ToggleButton from "./ToggleButton";
import IndentButtons from "./IndentButtons";

const BubbleMoreOption = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isSubscript,
    isSuperscript,
    isAlignLeft,
    isAlignRight,
    isAlignCenter,
    isAlignJustify,
  } = useEditorState({
    editor,
    selector: (ctx) => ({
      isSubscript: ctx.editor.isActive("subscript"),
      isSuperscript: ctx.editor.isActive("superscript"),
      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
      isAlignJustify: ctx.editor.isActive({ textAlign: "justify" }),
    }),
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <TooltipWraper title="More options">
        <PopoverTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
      </TooltipWraper>
      <PopoverContent
        className="p-1 rounded-xl max-w-fit "
        side="top"
        align="center"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex gap-0.5">
          <div className="flex gap-0.5">
            <ToggleButton
              tooltip="Subscript"
              isActive={isSubscript}
              icon={Subscript}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
            />
            <ToggleButton
              tooltip="Superscript"
              isActive={isSuperscript}
              icon={Superscript}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
            />
          </div>
          <Separator orientation="vertical" />
          <div className="flex gap-0.5">
            <ToggleButton
              tooltip="Align left"
              isActive={isAlignLeft}
              icon={TextAlignStart}
              onClick={() =>
                editor.chain().focus().toggleTextAlign("left").run()
              }
            />
            <ToggleButton
              tooltip="Align center"
              isActive={isAlignCenter}
              icon={TextAlignCenter}
              onClick={() =>
                editor.chain().focus().toggleTextAlign("center").run()
              }
            />
            <ToggleButton
              tooltip="Align right"
              isActive={isAlignRight}
              icon={TextAlignEnd}
              onClick={() =>
                editor.chain().focus().toggleTextAlign("right").run()
              }
            />
            <ToggleButton
              tooltip="Align justify"
              isActive={isAlignJustify}
              icon={TextAlignJustify}
              onClick={() =>
                editor.chain().focus().toggleTextAlign("justify").run()
              }
            />
          </div>
          <Separator orientation="vertical" />
          <IndentButtons editor={editor} />
        
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BubbleMoreOption;
