import { BlockGroupItem, BlockItem } from "../../blocks/types";

import { CommandGroup, CommandItem } from "~/components/ui/command";

interface CommandListItemsProps {
  groups: BlockGroupItem[];
  flatCommands: BlockItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export const MenuListGroup = ({
  groups,
  flatCommands,
  selectedIndex,
  onSelectIndex,
}: CommandListItemsProps) => {
  let absoluteIndexOffset = 0;
  return (
    <div className="space-y-2">
      {groups.map((blockGroupItem, i) => {
        const currentGroupCommands = blockGroupItem.commands;
        const groupStartOffset = absoluteIndexOffset;
        absoluteIndexOffset += currentGroupCommands.length;
        return (
          <CommandGroup
            heading={blockGroupItem.title}
            key={blockGroupItem.title}
          >
            {currentGroupCommands.map((block, relativeIndex) => {
              const itemIndex = groupStartOffset + relativeIndex;
              const isSelected = itemIndex === selectedIndex;
              return (
                <CommandItem
                  key={block.title}
                  onSelect={() => onSelectIndex(itemIndex)}
                >
                  {block.icon}
                  <span>{block.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        
        );
      })}
    </div>
  );
};
