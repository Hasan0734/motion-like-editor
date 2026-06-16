import { Editor, Range } from "@tiptap/core";
import { BlockGroupItem, BlockItem } from "../../blocks/types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import { MenuListGroup } from "./MenuListGroup";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "~/components/ui/command";
import { CalculatorIcon, CalendarIcon, CreditCardIcon, SettingsIcon, SmileIcon, UserIcon } from "lucide-react";

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
      <Command className="border shadow-2xl w-55 z-120" >
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <MenuListGroup flatCommands={flatCommands} groups={groups} selectedIndex={selectedIndex} onSelectIndex={selectItem}/>
        </CommandList>
      </Command>
    // <div className=" w-55 rounded-2xl p-0 pr-0.5 bg-card border transition-all duration-150 ease-out shadow-xl">
    //   <ScrollArea className="h-80 pr-3! p-2 space-y-2">
    //     <MenuListGroup
    //       groups={groups}
    //       selectedIndex={selectedIndex}
    //       onSelectIndex={selectItem}
    //       flatCommands={flatCommands}
    //     />
    //   </ScrollArea>
    // </div>
  );
});

SlashMenu.displayName = "SlashMenu";
export default SlashMenu;
