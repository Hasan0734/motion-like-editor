import React, { useState, useEffect, useRef } from "react";
import { Editor, useEditorState } from "@tiptap/react";
import { TocUIList } from "./TocUIList";
import { TableOfContentDataItem } from "@tiptap/extension-table-of-contents";
import { cn } from "~/lib/utils";
import { Command, CommandItem } from "~/components/ui/command";
import { ScrollArea } from "~/components/ui/scroll-area";
import TocSidebarContent from "./TocSidebarContent";
import TocPopover from "./TocPopover";

const Memorized = React.memo(TocUIList);

interface PropsType {
  editor: Editor | null;
  variant?: "content" | "line";
  scrollOver?: boolean;
}

export const TocSidebar = ({
  editor,
  variant = "content",
  scrollOver = false,
}: PropsType) => {
  if (!editor) return null;
  const [activeId, setActiveId] = useState<string | null>(null);

  const items = useEditorState({
    editor,
    selector: (ctx) =>
      (ctx.editor.storage.tableOfContents?.content ||
        []) as TableOfContentDataItem[],
  });

  const visibleHeadingsRef = useRef<Record<string, boolean>>({});

  // useEffect(() => {
  //   if (!editor || items.length === 0) return;

  //   visibleHeadingsRef.current = {};

  //   const observerOptions = {
  //     root: null,
  //     rootMargin: "-80px 0px -100px 0px",
  //     threshold: 0,
  //   };

  //   const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  //     entries.forEach((entry) => {
  //       visibleHeadingsRef.current[entry.target.id] = entry.isIntersecting;
  //     });

  //     const activeItem = items.find(
  //       (item) => visibleHeadingsRef.current[item.id],
  //     );

  //     if (activeItem) {
  //       setActiveId(activeItem.id);
  //     }
  //   };

  //   const observer = new IntersectionObserver(
  //     handleIntersection,
  //     observerOptions,
  //   );

  //   items.forEach((item) => {
  //     const el = document.getElementById(item.id);
  //     if (el) observer.observe(el);
  //   });

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [items, editor]);

  // const enhancedItems = items.map((item) => ({
  //   ...item,
  //   isActive: item.id === activeId,
  //   isScrolledOver: item.id === activeId,
  // }));

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside
      className={cn("toc-sidebar not-prose ", {
        "sticky top-20 self-start h-fit": variant === "content",
        relative: variant === "line",
      })}
    >
      <div
        className={cn("toc-sidebar-wrapper", {
          "w-60 p-2 h-full border-l flex flex-col": variant === "content",
          // "fixed top-1/2 right-0 translate-[0%,-50%]": showLine,
          "fixed top-1/2 right-4 -translate-y-1/2 z-50": variant === "line",
        })}
      >
        {variant === "line" && (
          <div className="toc-sidebar-inner">
            <Memorized items={items} scrollOver={scrollOver} />
            <TocPopover items={items} />
          </div>
        )}

        {variant === "content" && <TocSidebarContent items={items} scrollOver={scrollOver} />}
      </div> 
    </aside>
  );
};
