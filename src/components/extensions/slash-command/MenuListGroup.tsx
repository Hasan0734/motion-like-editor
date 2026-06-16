import { Editor, Range } from "@tiptap/core";
import { BlockGroupItem, BlockItem } from "../../blocks/types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";

import { Button } from "~/components/ui/button";
import { CommandGroup, CommandItem } from "~/components/ui/command";
import { CalendarIcon } from "lucide-react";

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
    <div className="space-y-2" >
      {groups.map((blockGroupItem, i) => {
        const currentGroupCommands = blockGroupItem.commands;
        const groupStartOffset = absoluteIndexOffset;
        absoluteIndexOffset += currentGroupCommands.length;
        return (
          <CommandGroup heading={blockGroupItem.title} key={blockGroupItem.title}>
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
          // <div className="space-y-2" key={blockGroupItem.title || i}>
          //   <div className="px-1 text-xs">{blockGroupItem.title}</div>
          //    <div>
          //      {currentGroupCommands.map((block, relativeIndex) => {
          //       const itemIndex = groupStartOffset + relativeIndex;
          //       const isSelected = itemIndex === selectedIndex;
          //       return (
          //         <Button
          //           key={block.title}
          //           variant={"ghost"}
          //           className="w-full justify-start pl-1.5"
          //           onClick={() => onSelectIndex(itemIndex)}
          //         >
          //           {block.icon}
          //           {block.title}
          //         </Button>
          //       );
          //     })}
          //    </div>
          // </div>
        );
      })}
    </div>
  );
};

// export const CommandListItems = ({
//   groups,
//   flatCommands,
//   selectedIndex,
//   onSelectIndex,
// }: CommandListItemsProps) => {
//   let absoluteIndexOffset = 0;
//   return (
//     <DropdownMenuContent
//       className="w-55 rounded-2xl max-h-80 p-0 pr-0.5 bg-card z-50  "
//       align="start"
//       sideOffset={5}
//     >
//       <ScrollArea className="h-64 pr-2">
//         {groups.map((blockGroupItem, i) => {
//           const currentGroupCommands = blockGroupItem.commands;
//           const groupStartOffset = absoluteIndexOffset;

//           absoluteIndexOffset += currentGroupCommands.length;
//           return (
//             <div key={blockGroupItem.title || i}>
//               <DropdownMenuGroup className="p-1.5">
//                 <DropdownMenuLabel className="text-foreground">
//                   {blockGroupItem.title}
//                 </DropdownMenuLabel>
//                 {currentGroupCommands.map((block, relativeIndex) => {
//                   const itemIndex = groupStartOffset + relativeIndex;
//                   const isSelected = itemIndex === selectedIndex;
//                   return (
//                     <DropdownMenuItem
//                       key={block.title}
//                       onClick={() => onSelectIndex(itemIndex)}
//                       className="text-muted-foreground p-1.5 pl-2 rounded-lg"
//                     >
//                       {block.icon}
//                       {block.title}
//                     </DropdownMenuItem>
//                   );
//                 })}
//               </DropdownMenuGroup>
//               {groups.length !== i + 1 && <DropdownMenuSeparator />}
//             </div>
//           );
//         })}
//       </ScrollArea>
//     </DropdownMenuContent>
//   );
// };
