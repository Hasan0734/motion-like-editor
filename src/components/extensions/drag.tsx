import DragHandle from "@tiptap/extension-drag-handle-react";
import { GripVertical, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Editor, Range } from "@tiptap/core";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { CommandListItems } from "./command-list";
import { blockItems } from "./suggestion";

const Dragable = ({ editor, range }: { editor: Editor, range: Range }) => {
  return (
    <DragHandle
      editor={editor}
      nested={false}
      computePositionConfig={{
        placement: "left-start",
        strategy: "absolute",
      }}
    >
      <div className="flex items-center gap-1 mr-2  ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} className="" size={"icon-sm"}>
              <Plus />
            </Button>
          </DropdownMenuTrigger>
          <CommandListItems range={range} editor={editor}  groups={items}/>
        </DropdownMenu>
        <Button variant={"ghost"} className="" size={"icon-sm"}>
          <GripVertical />
        </Button>
      </div>
    </DragHandle>
  );
};

export default Dragable;
