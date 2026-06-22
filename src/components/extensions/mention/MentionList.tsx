import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import { SuggestionProps } from "@tiptap/suggestion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";

export interface DropdownMenuRef {
  onKeyDown: (params: {
    event: KeyboardEvent | React.KeyboardEvent;
  }) => boolean;
}

interface MentionListProps extends SuggestionProps<string> {
  loading?: boolean;
}

const MentionList = forwardRef<DropdownMenuRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const selectItem = (index: number) => {
      const item = props.items[index];
      if (item) {
        props.command({ id: item });
      }
    };

    const upHandler = () => {
      if (props.items.length === 0) return;
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      if (props.items.length === 0) return;
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => {
      setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <Command className="border shadow-2xl w-55 z-[120]" loop>
        <CommandList>
          {props.loading ? (
            <div className="item loading p-2 text-sm text-muted-foreground flex items-center gap-2">
              <span className="loading-dot h-2 w-2 animate-pulse rounded-full bg-foreground" />
              Loading…
            </div>
          ) : props.items.length > 0 ? (
            <CommandGroup>
              {props.items.map((item, index) => (
                <CommandItem
                  key={item}
                  value={item}
                  /* Use shadcn/cmdk's standard aria-selected state or fall back to your manual active index classes */
                  className={cn("rounded-xl", {
                    "bg-accent text-accent-foreground": index === selectedIndex,
                  })}
                  onSelect={() => selectItem(index)}
                >
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </CommandList>
      </Command>
    );
  },
);

MentionList.displayName = "MentionList";

export default MentionList;
