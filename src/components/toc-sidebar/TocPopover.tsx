import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { cn } from "~/lib/utils";

const TocPopover = ({ items }: { items: TableOfContentDataItem[] }) => {
  return (
    <div className="toc-sidebar-nav">
      <div className="toc-sidebar-popover w-62.5 p-2 pr-px rounded-2xl border border-border shadow-xl bg-popover">
        <ScrollArea className="h-96 pr-4 **:space-y-px">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={cn(
                `toc-sidebar-item text-sm hover:bg-secondary hover:text-foreground text-muted-foreground rounded-md `,
                {
                  "bg-secondary text-foreground": item.isActive,
                },
              )}
              style={{ "--toc-depth": item.level } as React.CSSProperties}
            >
              {item.textContent}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default TocPopover;
