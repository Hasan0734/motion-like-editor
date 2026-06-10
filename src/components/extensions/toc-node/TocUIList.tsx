import React from "react";
import { Anchors } from "./types";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";


interface TocUIListProps {
  items: TableOfContentDataItem[];
}

export const TocUIList: React.FC<TocUIListProps> = ({ items }) => {
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
  // style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
  // console.log(items)

  return (
    <div className="toc-sidebar-progress">
      {items.map((item) => (
        <div
          onClick={() => handleScroll(item.id)}
          key={item.id}
          className={`toc-sidebar-progress-line ${item.isActive || item.isScrolledOver  ? 'toc-sidebar-progress-line-active' : ''}`}
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
