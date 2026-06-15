import { CSSProperties } from "react";
import TooltipWraper from "../TooltipWrapper";
import { Button } from "../ui/button";
import { Editor, useEditorState } from "@tiptap/react";

type Color = {
  name: string;
  value: string;
  type: string;
};

interface HighlightButtonProps {
  tooltip: string;
  color: Color;
  onClick: () => void;
  isActive?: boolean;
  editor: Editor;
}
const HighlightButton = ({
  tooltip,
  color,
  onClick,
  editor,
}: HighlightButtonProps) => {
  const { isActive } = useEditorState({
    editor,
    selector: (ctx) => ({
      isActive: ctx.editor.isActive("highlight", {
        color:
          color.value === "default"
            ? "var(--background)"
            : `var(--tt-color-highlight-${color.value})`,
      }),
    }),
  });

  return (
    <>
      <TooltipWraper title={tooltip}>
        <Button
          size={"icon"}
          variant={isActive ? "secondary" : "ghost"}
          onClick={onClick}
        >
          <span
            className="size-5 flex items-center justify-center rounded-full tiptap-button-highlight"
            style={
              {
                "--highlight-color":
                  color.value === "default"
                    ? "var(--background)"
                    : `var(--tt-color-highlight-${color.value})`,
              } as CSSProperties
            }
          ></span>
        </Button>
      </TooltipWraper>
    </>
  );
};

export default HighlightButton;
