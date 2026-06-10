import { ListOrdered } from "lucide-react";
import { BlockItem } from "./types";

export const tableOfContents: BlockItem = {
  title: "Table of Contents",
  description: "Insert a live outline of your headings.",
  searchTerms: ["toc", "table of contents", "outline", "headings"],
  icon: <ListOrdered  />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)          // Removes slash command text (e.g., "/toc")
      .insertContent({ type: 'tableOfContents' }) // Inserts the custom TOC node block
      .run();
  },
};
