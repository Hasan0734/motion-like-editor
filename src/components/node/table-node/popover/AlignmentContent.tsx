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
import { setTableCellAlignment } from "../utils/table";
import { getActiveTableCellAlignment } from "../utils/getActiveTableCellAlignment";

export const AlignmentDropdown = ({ editor }: { editor: Editor }) => {
  const { horizontal, vertical } = getActiveTableCellAlignment(editor);

  console.log(horizontal === "right");

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
          className="w-50 z-120"
        >
          <TableMenuItem
            onClick={() =>
              setTableCellAlignment(editor, {
                horizontal: "left",
              })
            }
            icon={TextAlignStart}
            label="Align left"
            className={
              horizontal === "left" ? "text-foreground! bg-accent!" : ""
            }
          />
          <TableMenuItem
            icon={TextAlignCenter}
            label="Align center"
            onClick={() =>
              setTableCellAlignment(editor, {
                horizontal: "center",
              })
            }
            className={
              horizontal === "center" ? "text-foreground! bg-accent!" : ""
            }
          />
          <TableMenuItem
            icon={TextAlignEnd}
            label="Align right"
            onClick={() =>
              setTableCellAlignment(editor, {
                horizontal: "right",
              })
            }
            className={
              horizontal === "right" ? "text-foreground! bg-accent!" : ""
            }
          />

          <DropdownMenuSeparator />

          <TableMenuItem
            icon={AlignVerticalJustifyStart}
            label="Align top"
            onClick={() =>
              setTableCellAlignment(editor, {
                vertical: "top",
              })
            }
            className={vertical === "top" ? "text-foreground! bg-accent!" : ""}
          />
          <TableMenuItem
            icon={AlignVerticalJustifyCenter}
            label="Align middle"
            onClick={() =>
              setTableCellAlignment(editor, {
                vertical: "middle",
              })
            }
            className={
              vertical === "middle" ? "text-foreground! bg-accent!" : ""
            }
          />
          <TableMenuItem
            icon={AlignVerticalJustifyEnd}
            label="Align bottom"
            onClick={() =>
              setTableCellAlignment(editor, {
                vertical: "bottom",
              })
            }
            className={
              vertical === "bottom" ? "text-foreground! bg-accent!" : ""
            }
          />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
