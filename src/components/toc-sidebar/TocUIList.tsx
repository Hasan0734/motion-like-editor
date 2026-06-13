import React from "react";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { cn } from "~/lib/utils";

interface TocUIListProps {
  items: TableOfContentDataItem[];
  scrollOver: boolean;
}

export const TocUIList: React.FC<TocUIListProps> = ({ items, scrollOver }) => {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic p-2">
        No headings found
      </p>
    );
  }

  return (
    <div className="toc-sidebar-progress">
      {items.map((item) => (
        <div
          onClick={() => handleScroll(item.id)}
          key={item.id}
          className={cn(`toc-sidebar-progress-line`, {
            "toc-sidebar-progress-line-active": scrollOver
              ? item.isScrolledOver
              : item.isActive,
          })}
          style={{ "--toc-depth": item.level } as React.CSSProperties}
        ></div>
      ))}
    </div>
  );
};

{
  /* <button
  onClick={() => handleScroll(item.id)}
  className="text-left text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block truncate w-full"
>
  {item.textContent}
</button>; */
}
