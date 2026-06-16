import type { BlockItem } from "./types";
import { UploadCloud } from "lucide-react";

export const uploadImage: BlockItem = {
  title: "Image",
  description: "Add a to drop zon and upload zone.",
  searchTerms: ["image", "img", "upload", "drop"],
  icon: <UploadCloud />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({ type: "imageUpload" })
      .run();
  },
};
