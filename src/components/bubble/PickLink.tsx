import React, { useCallback, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CornerDownLeft, ExternalLink, Link, Trash } from "lucide-react";
import TooltipWraper from "../TooltipWraper";
import { Button } from "../ui/button";
import { Editor } from "@tiptap/core";
import { Separator } from "../ui/separator";
import { useEditorState } from "@tiptap/react";
import { cn } from "~/lib/utils";

const PickLink = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");

  const { isLink, activeUrl } = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor.isActive("link"),
      activeUrl: ctx.editor.getAttributes("link").href || "",
    }),
  });

  useEffect(() => {
    if (isOpen) {
      setUrl(activeUrl);
    }
  }, [isOpen, activeUrl]);

  const setLink = useCallback(() => {
    if (!url) return;

    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();

      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [editor, url]);

  const unsetLink = useCallback(() => {
    try {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setUrl("");
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [editor]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setLink();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <TooltipWraper content="Link">
        <PopoverTrigger asChild>
          <Button variant={isLink ? "secondary" : "ghost"} size={"icon"}>
            <Link className={cn(isLink && "text-blue-500")} />
          </Button>
        </PopoverTrigger>
      </TooltipWraper>
      <PopoverContent
        className="p-1.5 rounded-xl w-78.75 shadow-xl"
        side="bottom"
        align="center"
      >
        <div className="flex items-center gap-1">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 outline-0 min-w-48 text-sm w-full h-8 py-1 pl-2.5 pr-0 bg-transparent"
            placeholder="Paste a link..."
            autoFocus
          />
          <div>
            <Button
              disabled={!url}
              onClick={setLink}
              variant={"ghost"}
              size={"icon"}
              type="button"
            >
              <CornerDownLeft  />
            </Button>
          </div>
          <Separator orientation="vertical" />
          <div className="flex gap-0.5">
            <Button disabled={!url} variant={"ghost"} size={"icon"} asChild>
              <a
                href={url || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(!url && "pointer-events-none opacity-50")}
              >
                <ExternalLink />
              </a>
            </Button>
            <Button
              disabled={!isLink}
              onClick={unsetLink}
              variant={"destructive"}
              size={"icon"}
            >
              <Trash  />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PickLink;
