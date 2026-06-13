import { EmojiItem } from "@tiptap/extension-emoji";
import { useMemo, useRef } from "react";
import TooltipWraper from "~/components/TooltipWraper";
import { Button } from "~/components/ui/button";
import { useVirtualizer } from "@tanstack/react-virtual";

interface EmojiListProps {
  items: EmojiItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

const EmojiList = ({ items, onSelectIndex }: EmojiListProps) => {
 const parentRef = useRef<HTMLDivElement>(null);
  const COLUMNS = 6;
  const BUTTON_SIZE = 32; 
  const GAP = 2;

  const rows = useMemo(() => {
    const result: EmojiItem[][] = [];
    for (let i = 0; i < items.length; i += COLUMNS) {
      result.push(items.slice(i, i + COLUMNS));
    }
    return result;
  }, [items]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => BUTTON_SIZE + GAP, 
    overscan: 5,
  });
  return (
    <div
      ref={parentRef}
      className="overflow-y-auto select-none scrollbar-none"
      style={{
        height: '260px', 
        width: '202px', 
      }}
    >
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              className="absolute top-0 left-0 w-full grid grid-cols-6"
              style={{
                height: `${BUTTON_SIZE}px`,
                gap: `${GAP}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {rowItems.map((emoji, colIdx) => {
                const originalIndex = virtualRow.index * COLUMNS + colIdx;

                return (
                  <TooltipWraper content={emoji.name} key={emoji.name}>
                    <Button
                      variant="secondary"
                      onClick={() => onSelectIndex(originalIndex)}
                      size="icon"
                      style={{ width: `${BUTTON_SIZE}px`, height: `${BUTTON_SIZE}px` }}
                      className="p-0 flex items-center justify-center shrink-0"
                    >
                      {emoji.fallbackImage ? (
                        <img
                          className="h-4 w-4 object-contain"
                          src={emoji.fallbackImage}
                          alt={emoji.name}
                        />
                      ) : (
                        <span className="text-base leading-none">{emoji.emoji}</span>
                      )}
                    </Button>
                  </TooltipWraper>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmojiList;

// <div ref={parentRef} className=" grid grid-cols-6 ">
//       {items.map((emoji, idx) => {

//         return (
//           <TooltipWraper content={emoji.name}>
//             <Button
//               variant={"secondary"}
//               key={emoji.name}
//               onClick={() => onSelectIndex(idx)}
//               className=""
//               size={"icon"}
//             >
//               {emoji.fallbackImage ? (
//                 <img
//                   className="h-4 w-4 flex justify-center items-center"
//                   src={emoji.fallbackImage}
//                   alt={emoji.name}
//                 />
//               ) : (
//                 emoji.emoji
//               )}
//             </Button>
//           </TooltipWraper>
//         );
//       })}
//     </div>
