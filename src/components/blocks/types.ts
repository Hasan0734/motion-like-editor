import { Range } from "@tiptap/core";
import { Editor } from "@tiptap/core";
import { JSX } from "react/jsx-runtime";

export interface CommandProps {
    editor: Editor;
    range: Range;
}

export type BlockItem = {
    title: string;
    description?: string;
    searchTerms: string[];
    icon?: JSX.Element;
    render?: (editor: Editor) => JSX.Element | null | true;
    preview?: string | ((editor: Editor) => JSX.Element | null);

} & (
        | {
            command: (options: CommandProps) => void;
            id?: never;
            commands?: never;
        }
        |
        {
            id: string;
            command?: never;
            commands?: BlockItem[]
        }
    )

export type BlockGroupItem = {
    title: string;
    commands: BlockItem[]
}