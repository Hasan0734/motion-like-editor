import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { BlockGroupItem } from "../blocks/types";
import { heading1, heading2, heading3, text } from "../blocks/typography";
import { bulletList, orderedList, taskList } from "../blocks/list";
import { htmlCodeBlock } from "../blocks/code";
import {
  ChevronDown,
  CodeXmlIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  LucideIcon,
  TextQuote,
  Type,
} from "lucide-react";
import { Button } from "../ui/button";
import { Editor } from "@tiptap/core";
import { Level } from "@tiptap/extension-heading";
import { useEditorState } from "@tiptap/react";

const items: BlockGroupItem[] = [
  {
    title: "Turn Into",
    commands: [
      text,
      heading1,
      heading2,
      heading3,
      bulletList,
      orderedList,
      taskList,
      htmlCodeBlock,
    ],
  },
];

const newItems = [
  {
    title: "Text",
    icon: Type,
  },
];

interface Headings {
  title: string;
  icon: LucideIcon;
  level: Level;
}

const headings: Headings[] = [
  {
    title: "Heading 1",
    icon: Heading1,
    level: 1,
  },
  {
    title: "Heading 2",
    icon: Heading2,
    level: 2,
  },
  {
    title: "Heading 3",
    icon: Heading3,
    level: 3,
  },
];

const TextTurnInto = ({ editor }: { editor: Editor }) => {
  const {
    activeBlock,
    isParagraph,
    isBulletList,
    isOrderedList,
    isTaskList,
    isBlockquote,
    isCodeBlock,
    headingLevel,
  } = useEditorState({
    editor,
    selector: (ctx) => {
      const activeHeading = headings.find((h) =>
        ctx.editor.isActive("heading", { level: h.level }),
      );
      return {
        activeBlock: ctx.editor.getAttributes("paragraph"),
        isParagraph: ctx.editor.isActive("paragraph"),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isTaskList: ctx.editor.isActive("taskList"),
        isBlockquote: ctx.editor.isActive("Blockquote"),
        isCodeBlock: ctx.editor.isActive("codeBlock"),
        headingLevel: activeHeading ? activeHeading.title : null,
      };
    },
  });

  const getTriggerLabel = () => {
    if (isParagraph) return "Text";
    if (headingLevel) return headingLevel;
    if (isBulletList) return "Bulleted list";
    if (isOrderedList) return "Numbered list";
    if (isTaskList) return "To-do list";
    if (isBlockquote) return "Blockquote";
    if (isCodeBlock) return "Code block";
    return "Text";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"}>
          {getTriggerLabel()} <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 rounded-2xl p-0 pr-px bg-popover shadow-2xl  z-50 overflow-hidden">
        <ScrollArea className="h-66.25 p-1.5 pr-2.5">
          {items.map((item, idx) => (
            <div key={item.title}>
              <div className="min-w-max flex relative flex-col justify-center align-middle">
                <div className="capitalize pt-3 pb-1 px-1.5 leading-normal font-medium text-xs text-muted-foreground">
                  Turn Into
                </div>
                <div className="flex flex-col">
                  <Button
                    variant={isParagraph ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                  >
                    <Type /> Text
                  </Button>
                  {headings.map((head) => (
                    <Heading head={head} editor={editor} />
                  ))}
                  <Button
                    variant={isBulletList ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                  >
                    <List /> Bulleted list
                  </Button>
                  <Button
                    variant={isOrderedList ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                  >
                    <ListOrdered /> Numbered list
                  </Button>
                  <Button
                    variant={isTaskList ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() =>
                      editor.chain().focus().toggleTaskList().run()
                    }
                  >
                    <ListTodo /> To-do list
                  </Button>

                  <Button
                    disabled={isTaskList}
                    variant={isBlockquote ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                  >
                    <TextQuote /> Blockquote
                  </Button>
                  <Button
                    disabled={isTaskList}
                    variant={isCodeBlock ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() =>
                      editor.chain().focus().toggleCodeBlock().run()
                    }
                  >
                    <CodeXmlIcon /> Code block
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default TextTurnInto;

const Heading = ({ head, editor }: { head: Headings; editor: Editor }) => {
  const { isActive } = useEditorState({
    editor,
    selector: (ctx) => ({
      isActive: ctx.editor.isActive("heading", { level: head.level }),
    }),
  });
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className="w-full justify-start"
      onClick={() =>
        editor.chain().focus().toggleHeading({ level: head.level }).run()
      }
    >
      <head.icon /> {head.title}
    </Button>
  );
};
