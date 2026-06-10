import { AtSign } from "lucide-react";
import { BlockItem } from "./types";

export const mention: BlockItem = {
  title: "Mention",
  description: "Add a call to action button to email.",
  searchTerms: ["mention", "user"],
  icon: <AtSign  />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().insertContent("@").run()
  },
};
