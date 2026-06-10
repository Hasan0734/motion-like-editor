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

const EditorNav = () => {
  return (
    <div className="flex items-center justify-end py-2 px-4 border-b border-border gap-2 ">
      <div className="flex gap-1">
        <Button size={"icon"} variant={"ghost"}>
          <Undo />
        </Button>
        <Button size={"icon"} variant={"ghost"}>
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
