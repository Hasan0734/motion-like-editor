import { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import ToggleButton from "../ToggleButton";
import { Download, RefreshCcw, Trash, Trash2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { AlignCenter, AlignLeft, AlignRight, CaptionIcon } from "./icon";
import { useEditorState } from "@tiptap/react";
import { Dispatch, SetStateAction } from "react";

interface ImageBubbleMenuProps {
  editor: Editor | null;
  onReplaceClick: () => void;
}

const ImageBubbleMenu = ({ editor, onReplaceClick }: ImageBubbleMenuProps) => {
  if (!editor) {
    return;
  }

  const { alignment } = editor.getAttributes("image");
  const setAlignment = (nextAlignment: string) => {
    editor
      .chain()
      .focus()
      .updateAttributes("image", { alignment: nextAlignment })
      .run();
  };



  return (
    <BubbleMenu
      pluginKey="imageMenu"
      editor={editor}
      shouldShow={({ editor, view }) => {
        return view.hasFocus() && editor.isActive("image");
      }}
      options={{
        offset: 6,
      }}
      className="bg-card not-prose border shadow-xl rounded-xl px-0.5 flex items-center gap-1 py-0.5"
    >
      <div className=" flex items-center gap-1 ">
        <ToggleButton
          tooltip="Image align left"
          icon={<AlignLeft />}
          isActive={alignment === "left"}
          onClick={() => setAlignment("left")}
        />
        <ToggleButton
          tooltip="Image align center"
          icon={<AlignCenter />}
          isActive={alignment === "center"}
          onClick={() => setAlignment("center")}
        />
        <ToggleButton
          tooltip="Image align right"
          icon={<AlignRight />}
          isActive={alignment === "right"}
          onClick={() => setAlignment("right")}
        />
      </div>
      {/* <Separator orientation="vertical" />
      <div className="flex gap-0.5">
        <ToggleButton
          tooltip="Caption"
          icon={<CaptionIcon />}
          isActive={caption}
          onClick={() =>  setCaption(!caption)}
        />
      </div> */}
      <Separator orientation="vertical" />
      <div className="flex gap-0.5">
        <ToggleButton
          tooltip="Download image"
          icon={Download}
          //   isActive={isBold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToggleButton
          tooltip="Replace"
          icon={RefreshCcw}
          onClick={onReplaceClick}
        />
        <ToggleButton
          variant="destructive"
          tooltip="Delete"
          icon={Trash2}
          //   isActive={isBold}
          onClick={() => editor.chain().focus().deleteSelection().run()}
        />
      </div>
    </BubbleMenu>
  );
};

export default ImageBubbleMenu;

// const ToggleButton = ({
//   onClick,
//   isActive,
//   icon,
//   className,
//   text,
//   size,
//   showTooltip,
//   tooltip,
//   disabled,
// }: ToggleButtonProps) => {
//   const Icon = icon;

//   return (
//     <TooltipWraper content={tooltip} showTooltip={showTooltip}>
//       <Button
//         size={size ? size : text ? "default" : "icon"}
//         variant={isActive ? "secondary" : "ghost"}
//         className={cn( className)}
//         onClick={onClick}
//         disabled={disabled}
//       >
//         <Icon className="stroke-[2.75] "/> {text}
//       </Button>
//     </TooltipWraper>
//   );
// };
