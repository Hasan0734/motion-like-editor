import React, { forwardRef, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import EmojiList from "./EmojiList";
import { EmojiItem, EmojiOptions } from "@tiptap/extension-emoji";
import { Command, Editor } from "@tiptap/core";

type CommandProps = {
  name: string;
};

type EmojiListProps = {
  items: EmojiItem[];
  editor: Editor;
  command: (arg0: CommandProps) => void;
  range: Range;
  query: string;
};

const EmojiPicker = forwardRef<unknown, EmojiListProps>((props, ref) => {
  const { items, command, editor, range, query } = props;
  const [isOpen, setIsOpen] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ name: item.name });
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="sr-only"></DropdownMenuTrigger>
      <EmojiList
        items={items}
        selectedIndex={selectedIndex}
        onSelectIndex={selectItem}
      />
    </DropdownMenu>
  );
});

EmojiPicker.displayName = "EmojiPicker";
export default EmojiPicker;
