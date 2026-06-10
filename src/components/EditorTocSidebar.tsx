import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import throttle from "lodash.throttle";

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

interface EditorTocSidebarProps {
  editor: Editor | null;
}

export const EditorTocSidebar: React.FC<EditorTocSidebarProps> = ({ editor }) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);


  console.log({headings})

  useEffect(() => {
    if (!editor) return;

    // Extract all headings from the editor's inner document JSON tree
    const updateHeadings = throttle(() => {
      const headingList: HeadingItem[] = [];
      
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "heading") {
          const text = node.textContent;
          const level = node.attrs.level;
          
          // Generate an anchor-friendly ID slug from the heading text
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          headingList.push({ id, text, level });

          // Programmatically assign the ID attribute to the actual editor node if missing
          if (node.attrs.id !== id) {
            editor.view.dispatch(
              editor.state.tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id,
              })
            );
          }
        }
      });

      setHeadings(headingList);
    }, 400);

    // Listen to changes in text or structure
    editor.on("update", updateHeadings);
    
    // Initial fetch
    updateHeadings();

    return () => {
      editor.off("update", updateHeadings);
    };
  }, [editor]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings?.length === 0) {
    return (
      <div className="w-64 p-4 border-l border-border text-muted-foreground text-xs italic">
        No headings added yet.
      </div>
    );
  }

  return (
    <div className="w-64 p-4 border-l border-border h-full sticky top-0 overflow-y-auto">
      <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">
        Table of Contents
      </h3>
      <nav className="flex flex-col gap-2">
        {headings.map((heading, index) => (
          <button
            key={`${heading.id}-${index}`}
            onClick={() => scrollToHeading(heading.id)}
            className="text-left text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer block truncate"
            style={{
              paddingLeft: `${(heading.level - 1) * 12}px`,
            }}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
};
