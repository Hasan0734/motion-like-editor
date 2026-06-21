import { Editor, Range } from "@tiptap/core";
import { BlockGroupItem, BlockItem } from "../../blocks/types";
import { forwardRef, useEffect, useState } from "react";
import { MenuListGroup } from "./MenuListGroup";
import { Command, CommandEmpty, CommandList } from "~/components/ui/command";

type CommandListProps = {
  items: BlockGroupItem[];
  command: (item: BlockItem) => void;
  editor: Editor;
  range: Range;
  query: string;
};

const SlashMenu = forwardRef<unknown, CommandListProps>((props, ref) => {
  const { items: groups, command, editor, range, query } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const flatCommands = groups.flatMap((group) => group.commands);

  useEffect(() => {
    setSelectedIndex(0);
  }, [groups]);

  const selectItem = (index: number) => {
    const item = flatCommands[index];
    if (item) {
      command(item);
    }
  };

  return (
    <Command className="border shadow-2xl w-55 z-120">
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <MenuListGroup
          flatCommands={flatCommands}
          groups={groups}
          selectedIndex={selectedIndex}
          onSelectIndex={selectItem}
        />
      </CommandList>
    </Command>
   
  );
});

SlashMenu.displayName = "SlashMenu";
export default SlashMenu;
