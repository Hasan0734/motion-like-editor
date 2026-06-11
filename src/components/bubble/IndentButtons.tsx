import ToggleButton from "../ToggleButton";
import { Editor,  } from "@tiptap/react";
import { ListIndentDecrease, ListIndentIncrease } from "lucide-react";

const IndentButtons = ({ editor }: { editor: Editor }) => {
  const currentLevel =
    editor.getAttributes("paragraph")["data-indent-level"] ||
    editor.getAttributes("heading")["data-indent-level"] ||
    0;

  const isMinIndent = currentLevel <= 0;
  const isMaxIndent = currentLevel >= 10;
  return (
    <div className="flex gap-0.5">
      <ToggleButton
        tooltip="Decrease indent"
        disabled={isMinIndent}
        icon={ListIndentDecrease}
        onClick={() => editor.chain().focus().outdent().run()}
      />
      <ToggleButton
        tooltip="Increase indent"
        disabled={isMaxIndent}
        icon={ListIndentIncrease}
        onClick={() => editor.chain().focus().indent().run()}
      />
    </div>
  );
};

export default IndentButtons;
