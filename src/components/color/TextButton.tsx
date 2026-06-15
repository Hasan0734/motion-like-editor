import { CSSProperties } from "react";
import TooltipWraper from "../TooltipWrapper";
import { Button } from "../ui/button";
import { TextIcon } from "./icon";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

interface TextButtonProps {
  tooltip: string;
  color: string;
  onClick: () => void;
  editor: Editor;
}

const TextButton = ({ tooltip, color, onClick, editor }: TextButtonProps) => {
  const { isActive } = useEditorState({
    editor,
    selector: (ctx) => ({
      isActive: ctx.editor.isActive("textStyle", {
        color: `var(--tt-color-text-${color})`,
      }),
    }),
  });

  return (
    <>
      <TooltipWraper title={tooltip}>
        <Button
          size={"icon"}
          variant={isActive ? "secondary" : "ghost"}
          style={
            {
              "--color-text-button-color": `var(--tt-color-text-${color})`,
            } as CSSProperties
          }
          onClick={onClick}
        >
          <span
            className="size-5 flex items-center justify-center rounded-full tiptap-button-color-text"
            style={{
              color: `var(--tt-color-text-${color})`,
            }}
          >
            <TextIcon />
          </span>
        </Button>
      </TooltipWraper>
    </>
  );
};

export default TextButton;
