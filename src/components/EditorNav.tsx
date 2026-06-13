import { Button } from "~/components/ui/button";
import { Redo, Undo } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from "./ui/dropdown-menu";
import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";

const EditorNav = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return;
  }

  const { canUndo, canRedo } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        canUndo: ctx.editor.can().chain().focus().undo().run(),
        canRedo: ctx.editor.can().chain().focus().redo().run(),
      };
    },
  });

  return (
    <div className="fixed w-full  z-100 bg-background/10 top-0 backdrop-blur-2xl flex items-center justify-end py-2.5 px-4 border-b border-border gap-2 ">
      <div className="flex gap-1">
        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!canUndo}
          size={"icon"}
          variant={"ghost"}
        >
          <Undo />
        </Button>
        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!canRedo}
          size={"icon"}
          variant={"ghost"}
        >
          <Redo />
        </Button>
      </div>
      <Separator orientation="vertical" decorative />
      <ThemeToggle />
      <Separator orientation="vertical" decorative />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32" align="end" side="bottom">
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EditorNav;
