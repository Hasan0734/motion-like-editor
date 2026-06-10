import { AtSign, Minus } from "lucide-react";
import { BlockItem } from "./types";

export const separator: BlockItem = {
  title: "Separator",
  description: "Insert a horizontal dividing line.",
  searchTerms: ["separator", "hr", "line", "divider"],
  icon: <Minus  />,
  command: ({ editor, range }) => {
    editor
      .chain()
      .focus()
      .deleteRange(range)    // Removes the slash command text (e.g., "/separator")
      .setHorizontalRule()   // Inserts the Tiptap horizontal rule block
      .run();
  },
};