import React, { useState, useEffect } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { TocUIList } from "./TocUIList";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { cn } from "~/lib/utils";

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

  useEffect(() => {
    if (!editor || items.length === 0) return;

    const scrollContainer = document.querySelector(".editor-scroll-container");
    if (!scrollContainer) return;

    const handleScrollCheck = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      let currentActiveId = activeId;
      const triggerPoint = containerRect.top;
      for (let i = 0; i < items.length; i++) {
        const el = document.getElementById(items[i].id);
        if (!el) continue;

        const headingRect = el.getBoundingClientRect();
        if (headingRect.top <= triggerPoint + 10) {
          currentActiveId = items[i].id;
        } else if (i === 0) {
          currentActiveId = items[0].id;
          break;
        } else {
          break;
        }
      }
      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    scrollContainer.addEventListener("scroll", handleScrollCheck, {
      passive: true,
    });
    editor.on("update", handleScrollCheck);
    handleScrollCheck();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScrollCheck);
      editor.off("update", handleScrollCheck);
    };
  }, [items, editor, activeId]);

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
            <div className="toc-sidebar-popover rounded-2xl p-2 border border-border backdrop-blur-2xl shadow-xl bg-popover">
              {enhancedItems.map((item) => (
                <div
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
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
