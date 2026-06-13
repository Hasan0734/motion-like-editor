import { forwardRef, useEffect, useState } from "react";
import EmojiList from "./EmojiList";
import { EmojiItem } from "@tiptap/extension-emoji";
import { Editor } from "@tiptap/core";

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
  const { items } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ name: item.name });
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  return (
    <div className=" p-1.5 scrollbar-none overflow-y-scroll bg-card rounded-xl border shadow-2xl min-h-10">
      {items.length > 0 ? (
        <EmojiList
          items={items}
          selectedIndex={selectedIndex}
          onSelectIndex={selectItem}
        />
      ) : (
        <div className="p-1 text-sm text-muted-foreground ">No emoji found</div>
      )}
    </div>
  );
});

EmojiPicker.displayName = "EmojiPicker";
export default EmojiPicker;
