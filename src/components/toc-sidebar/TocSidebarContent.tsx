import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import React from "react";
import { cn } from "~/lib/utils";

const TocSidebarContent = ({
  items,
  scrollOver,
}: {
  items: TableOfContentDataItem[];
  scrollOver: boolean;
}) => {
  return (
    <div className="flex flex-col gap-1 w-full text-sm text-neutral-600 dark:text-neutral-400">
      {/* Sidebar Header */}
      <div className="px-3 py-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase select-none">
        Table of Contents
      </div>

      {items.map((item) => (
        <button
          key={item.id || item.textContent}
          onClick={() => {
            document
              .getElementById(item.id)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            ` flex items-center w-full px-3 py-1.5 text-left rounded-md  transition-all duration-200 ease-in-out group relative hover:bg-accent`,
            {
              "bg-accent text-muted-foreground!": !scrollOver &&  item.isActive,
              "text-gray-500": item.isScrolledOver
            },
          )}
          style={{
            paddingLeft: `${((item.level || 1) - 1) * 12 + 12}px`,
          }}
        >
          {/* Active Left Indicator Bar */}
          {/* {isActive && (
              <span className="transition-all duration-200 absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-r" />
            )} */}

          <span className="truncate">{item.textContent}</span>
        </button>
      ))}
    </div>
  );
};

export default TocSidebarContent;
