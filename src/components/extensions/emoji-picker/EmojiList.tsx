import { EmojiItem } from "@tiptap/extension-emoji";
import TooltipWraper from "~/components/TooltipWraper";
import { Button } from "~/components/ui/button";
import { DropdownMenuContent } from "~/components/ui/dropdown-menu";
// import { ScrollArea } from "~/components/ui/scroll-area";

interface EmojiListProps {
  items: EmojiItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

const EmojiList = ({ items, onSelectIndex }: EmojiListProps) => {
  return (
    <DropdownMenuContent
      className="w-53 rounded-2xl max-h-65 p-1.5 bg-card z-50 scrollbar-none shadow-2xl"
      align="start"
      sideOffset={5}
    >
      {/* <ScrollArea className="h-64 pr-2"> */}
      <div>
        <input
          className="border rounded-xl text-sm px-2 w-full"
          placeholder="Emoji name"
        />
      </div>

      <div className=" grid grid-cols-6">
        {items.map((emoji, idx) => {
          //   const isSelected = idx === selectedIndex;

          console.log(emoji);
          return (
            <TooltipWraper title={emoji.name}>
              <Button
                variant={"secondary"}
                key={emoji.name}
                onClick={() => onSelectIndex(idx)}
                className=""
                size={"icon"}
              >
                {emoji.fallbackImage ? (
                  <img
                    className="h-4 w-4 flex justify-center items-center"
                    src={emoji.fallbackImage}
                    alt={emoji.name}
                  />
                ) : (
                  emoji.emoji
                )}
              </Button>
            </TooltipWraper>
          );
        })}
      </div>
      {/* </ScrollArea> */}
    </DropdownMenuContent>
  );
};

export default EmojiList;
