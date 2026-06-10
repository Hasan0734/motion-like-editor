import type { BlockItem } from "./types";
import { List, ListOrdered, ListTodo } from "lucide-react";

export const bulletList: BlockItem = {
  title: "Bullet List",
  description: "Create a simple bullet list.",
  searchTerms: ["unordered", "point"],
  icon: <List />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).toggleBulletList().run();
  },
};

export const orderedList: BlockItem = {
  title: "Numbered List",
  description: "Create a list with numbering.",
  searchTerms: ["ordered"],
  icon: <ListOrdered />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
  },
};

export const taskList: BlockItem = {
  title: "Tod-do list",
  description: "Create a todo list",
  searchTerms: ["list", "task", "todo"],
  icon: <ListTodo />,
  command: ({editor, range}) => {
    editor.chain().focus().deleteRange(range).toggleTaskList().run()
  }
};
