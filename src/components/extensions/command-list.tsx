import { Editor, Range } from "@tiptap/core";
import { BlockGroupItem, BlockItem } from "../blocks/types";
import { forwardRef, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

type CommandListProps = {
  items: BlockGroupItem[];
  command: (item: BlockItem) => void;
  editor: Editor;
  range: Range;
  query: string;
};

const CommandList = forwardRef<unknown, CommandListProps>((props, ref) => {
  const { items: groups, command, editor, range, query } = props;
  const [isOpen, setIsOpen] = useState(true);
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="sr-only"></DropdownMenuTrigger>
      <CommandListItems
        groups={groups}
        selectedIndex={selectedIndex}
        onSelectIndex={selectItem}
        flatCommands={flatCommands}
      />
    </DropdownMenu>
  );
});

CommandList.displayName = "CommandList";
export default CommandList;

interface CommandListItemsProps {
  groups: BlockGroupItem[];
  flatCommands: BlockItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}
export const CommandListItems = ({
  groups,
  flatCommands,
  selectedIndex,
  onSelectIndex,
}: CommandListItemsProps) => {
  let absoluteIndexOffset = 0;
  return (
    <DropdownMenuContent
      className="w-55 rounded-2xl max-h-80 p-0 pr-0.5 bg-card z-50"
      align="start"
      sideOffset={5}
    >
      <ScrollArea className="h-64 pr-2">
        {groups.map((blockGroupItem, i) => {
          const currentGroupCommands = blockGroupItem.commands;
          const groupStartOffset = absoluteIndexOffset;

          absoluteIndexOffset += currentGroupCommands.length;
          return (
            <div key={blockGroupItem.title || i}>
              <DropdownMenuGroup className="p-1.5">
                <DropdownMenuLabel className="text-foreground">
                  {blockGroupItem.title}
                </DropdownMenuLabel>
                {currentGroupCommands.map((block, relativeIndex) => {
                  const itemIndex = groupStartOffset + relativeIndex;
                  const isSelected = itemIndex === selectedIndex;
                  return (
                    <DropdownMenuItem
                      key={block.title}
                      onClick={() => onSelectIndex(itemIndex)}
                      className="text-muted-foreground p-1.5 pl-2 rounded-lg"
                    >
                      {block.icon}
                      {block.title}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
              {groups.length !== i + 1 && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </ScrollArea>
    </DropdownMenuContent>
  );
};
