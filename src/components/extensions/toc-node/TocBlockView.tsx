import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { TocUIList } from "./TocUIList";
import { Anchors } from "./types";
import { TableOfContentData, TableOfContentDataItem } from "@tiptap/extension-table-of-contents";

const TocBlockView: React.FC<NodeViewProps> = ({ editor }) => {
  const headings: TableOfContentDataItem[] = editor.storage.tableOfContents?.content || [];
  return (
    <NodeViewWrapper className="my-6 p-4 border border-border bg-muted/30 rounded-xl max-w-md">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Document Table of Contents
      </div>
      <TocUIList items={headings} />
    </NodeViewWrapper>
  );
};

export default TocBlockView;
