import { EmojiItem } from "@tiptap/extension-emoji";
import TooltipWraper from "~/components/TooltipWraper";
import { Button } from "~/components/ui/button";

interface EmojiListProps {
  items: EmojiItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

const EmojiList = ({ items, onSelectIndex }: EmojiListProps) => {
  return (
    <div className=" grid grid-cols-6">
      {items.map((emoji, idx) => {

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
  );
};

export default EmojiList;
