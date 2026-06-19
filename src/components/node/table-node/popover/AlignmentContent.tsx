import { Editor } from "@tiptap/core";
import {
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import { TableMenuItem } from "./TableMenuItem";
import {
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
} from "lucide-react";
import { AlignmentIcon } from "~/components/color/icon";
import { ITEM_CLASSNAME } from "./TableMenuPopover";

export const AlignmentDropdown = ({ editor }: { editor: Editor }) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={ITEM_CLASSNAME}>
        <AlignmentIcon className="size-4 shrink-0 text-muted-foreground" />
        <span>Alignment</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent
          sideOffset={8}
          alignOffset={-90}
          className="w-50"
        >
          <TableMenuItem
            icon={TextAlignStart}
            label="Align left"
            onClick={() => editor.chain().focus().run()}
          />
          <TableMenuItem
            icon={TextAlignCenter}
            label="Align center"
            onClick={() => editor.chain().focus().run()}
          />
          <TableMenuItem
            icon={TextAlignEnd}
            label="Align right"
            onClick={() => editor.chain().focus().run()}
          />

          <DropdownMenuSeparator />

          <TableMenuItem
            icon={AlignVerticalJustifyStart}
            label="Align top"
            onClick={() => editor.chain().focus().run()}
          />
          <TableMenuItem
            icon={AlignVerticalJustifyCenter}
            label="Align middle"
            onClick={() => editor.chain().focus().run()}
          />
          <TableMenuItem
            icon={AlignVerticalJustifyEnd}
            label="Align bottom"
            onClick={() => editor.chain().focus().run()}
          />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
