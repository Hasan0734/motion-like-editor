import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Code,
  Italic,
  Sparkles,
  Strikethrough,
  Underline,
} from "lucide-react";

import ToggleButton from "../ToggleButton";
import { useEditorState } from "@tiptap/react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import TooltipWraper from "../TooltipWraper";
import PickLink from "./PickLink";
import BubbleMoreOption from "./BubbleMoreOption";
import ColorDropdown from "../color/ColorDropdown";
import TextTurnInto from "./TextTurnInto";

const MyBubbleMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return;
  }

  const { isBold, isItalic, isStrikethrough, isUnderline, isCode } =
    useEditorState({
      editor,
      selector: (ctx) => ({
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isStrikethrough: ctx.editor.isActive("strike"),
        isUnderline: ctx.editor.isActive("underline"),
        isCode: ctx.editor.isActive("code"),
      }),
    });

  return (
    <BubbleMenu
      editor={editor}
      className="bg-card not-prose border shadow-xl rounded-xl px-1 flex items-center gap-1 py-1"
    >
      <div>
        <TooltipWraper title="Improve">
          <Button variant={"ghost"}>
            <Sparkles /> Improve
          </Button>
        </TooltipWraper>
      </div>
      <Separator orientation="vertical" />
      <TextTurnInto editor={editor}/>
      <Separator orientation="vertical" />
      <div className=" flex items-center gap-1 ">
        <ToggleButton
          tooltip="Bold"
          icon={Bold}
          isActive={isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={isCode}
        />
        <ToggleButton
          tooltip="Italic"
          icon={Italic}
          isActive={isItalic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={isCode}
        />

        <ToggleButton
          tooltip="Underline"
          icon={Underline}
          isActive={isUnderline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={isCode}
        />
        <ToggleButton
          tooltip="Strikethrough"
          icon={Strikethrough}
          isActive={isStrikethrough}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={isCode}
        />
        <ToggleButton
          tooltip="Code"
          icon={Code}
          isActive={isCode}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
      </div>
      <Separator orientation="vertical" />
      <div className=" flex gap-0.5">
        <PickLink editor={editor} />
        <ColorDropdown editor={editor} />
      </div>
      <Separator orientation="vertical" />
      <BubbleMoreOption editor={editor} />
    </BubbleMenu>
  );
};

export default MyBubbleMenu;
