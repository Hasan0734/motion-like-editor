import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react';
import TocBlockView from './TocBlockView';

export interface TocNodeOptions {
  topOffset: number;
  maxShowCount: number;
  showTitle: boolean;
  HTMLAttributes: Record<string, any>;
}

export const TocNode = Node.create<TocNodeOptions>({
  name: "toc-node",
  group: 'block',
  atom: true,
  addOptions() {
    return {
      topOffset: 0,
      maxShowCount: 10,
      showTitle: true,
      HTMLAttributes: {
        class: "my-custom-toc"
      }
    }
  },
  parseHTML() {
    return [{ tag: 'div[data-type="table-of-contents"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "table-of-contents" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TocBlockView)
  }
})