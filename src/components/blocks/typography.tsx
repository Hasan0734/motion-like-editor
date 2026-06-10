import type { BlockItem } from "./types";
import {
  Heading1,
  Heading2,
  Heading3,
  DivideIcon,
  TextQuote,
  FootprintsIcon,
  EraserIcon,
  Type,
} from "lucide-react";

export const text: BlockItem = {
  title: "Text",
  description: "Just start typing with plain text.",
  searchTerms: ["p", "paragraph"],
  icon: <Type  />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .toggleNode("paragraph", "paragraph")
      .run();
  },
};

export const heading1: BlockItem = {
  title: "Heading 1",
  description: "Big heading.",
  searchTerms: ["h1", "title", "big", "large"],
  icon: <Heading1  />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 1 })
      .run();
  },
};

export const heading2: BlockItem = {
  title: "Heading 2",
  description: "Medium heading.",
  searchTerms: ["h2", "subtitle", "medium"],
  icon: <Heading2  />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 2 })
      .run();
  },
};

export const heading3: BlockItem = {
  title: "Heading 3",
  description: "Small heading.",
  searchTerms: ["h3", "subtitle", "small"],
  icon: <Heading3  />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .setNode("heading", { level: 3 })
      .run();
  },
};

export const hardBreak: BlockItem = {
  title: "Hard Break",
  description: "Add a break between lines.",
  searchTerms: ["break", "line"],
  icon: <DivideIcon  />,
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).setHardBreak().run();
  },
};

export const blockquote: BlockItem = {
  title: "Blockquote",
  description: "Add blockquote.",
  searchTerms: ["quote", "blockquote"],
  icon: <TextQuote  />,
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range).toggleBlockquote().run();
  },
};

export const footer: BlockItem = {
  title: "Footer",
  description: "Add a footer text to email.",
  searchTerms: ["footer", "text"],
  icon: <FootprintsIcon  />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).setFooter().run();
  },
};

export const clearLine: BlockItem = {
  title: "Clear Line",
  description: "Clear the current line.",
  searchTerms: ["clear", "line"],
  icon: <EraserIcon  />,
  command: ({ editor, range }) => {
    editor.chain().focus().selectParentNode().deleteSelection().run();
  },
};
