import React, { useState, useEffect, useRef } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { TocUIList } from "./TocUIList";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { cn } from "~/lib/utils";
import { Command, CommandItem } from "~/components/ui/command";
import { ScrollArea } from "~/components/ui/scroll-area";

const Memorized = React.memo(TocUIList);

export const TocSidebar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  const [activeId, setActiveId] = useState<string | null>(null);

  const items = useEditorState({
    editor,
    selector: (ctx) =>
      (ctx.editor.storage.tableOfContents?.content ||
        []) as TableOfContentDataItem[],
  });

  const visibleHeadingsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!editor || items.length === 0) return;

    visibleHeadingsRef.current = {};

    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -100px 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        visibleHeadingsRef.current[entry.target.id] = entry.isIntersecting;
      });

      const activeItem = items.find(
        (item) => visibleHeadingsRef.current[item.id],
      );

      if (activeItem) {
        setActiveId(activeItem.id);
      }
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions,
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [items, editor]);

  const enhancedItems = items.map((item) => ({
    ...item,
    isActive: item.id === activeId,
    isScrolledOver: item.id === activeId,
  }));

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  return (
    <aside className="toc-sidebar not-prose">
      <div className="toc-sidebar-wrapper">
        <div className="toc-sidebar-inner">
          <Memorized items={enhancedItems} />
          <div className="toc-sidebar-nav">
            <div className="toc-sidebar-popover w-62.5 p-2 pr-px rounded-2xl border border-border shadow-xl bg-popover">
              <ScrollArea className="h-96 pr-4 **:space-y-px">
                {enhancedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleScroll(item.id)}
                    className={cn(
                      `toc-sidebar-item text-sm hover:bg-secondary hover:text-foreground text-muted-foreground rounded-md `,
                      {
                        "bg-secondary text-foreground":
                          item.isActive || item.isScrolledOver,
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
        </div>
      </div>
    </aside>
  );
};
