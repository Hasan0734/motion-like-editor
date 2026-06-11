import { Placeholder } from '@tiptap/extension-placeholder';
import { AnyExtension } from "@tiptap/core";
import { baseKit } from "./base-kit";
import { BlockGroupItem } from "../blocks/types";
import { SlashCommand } from "./slash-command";
import suggestion from "./suggestion";
import { ListKit } from '@tiptap/extension-list'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { TableOfContents } from '@tiptap/extension-table-of-contents'
import { TableKit } from '@tiptap/extension-table'
import { Gapcursor } from '@tiptap/extensions'
import { Document } from '@tiptap/extension-document'
import { Mention } from '@tiptap/extension-mention'
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { v4 as uuidv4 } from 'uuid'
import { Bold } from '@tiptap/extension-bold'
import { Italic } from '@tiptap/extension-italic'
import { Strike } from '@tiptap/extension-strike'
import { Underline } from '@tiptap/extension-underline'
import { Code } from '@tiptap/extension-code'
import { CodeBlock } from '@tiptap/extension-code-block'
import { Link } from '@tiptap/extension-link'
import { Highlight } from '@tiptap/extension-highlight'
import { TextStyle, Color, BackgroundColor } from '@tiptap/extension-text-style'
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { TextAlign } from "@tiptap/extension-text-align"
import { UndoRedo } from '@tiptap/extensions'
import { Indent } from './Indent';


type ExtensionProps = {
    extensions?: AnyExtension[];
    blocks: BlockGroupItem[] | undefined
}

export function extensions(props: ExtensionProps) {
    const { blocks, extensions = [] } = props;

    const defaultExtensions = [
        Document,
        UndoRedo,
        Bold,
        Italic,
        Strike,
        Underline,
        Code,
        CodeBlock,
        Subscript,
        Superscript,
        Link.configure({
            openOnClick: false,
            enableClickSelection: true,

        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right', 'justify'],
        }),
        Highlight.configure({ multicolor: true }),
        TextStyle,
        Color,
        BackgroundColor,
        SlashCommand.configure({
            suggestion
        }),
        Placeholder.configure({
            placeholder: ({ node }) => {
                if (node.type.name === "heading") {
                    return `Heading ${node.attrs.level}`
                }
                return "Write, type '/' for commands..."
            },
            dataAttribute: "placeholder",
            showOnlyWhenEditable: false,
        }),
        Heading.configure({
            levels: [1, 2, 3]
        }),
        Paragraph,
        Text,
        ListKit.configure({
            listItem: {
                HTMLAttributes: {
                    class: "not-prose"
                }
            },
            taskList: {
                HTMLAttributes: {
                    class: "not-prose"
                }
            }
        }),
        TableOfContents.configure({
            getId: () => uuidv4()

        }),
        // TocNode.configure({
        //     topOffset: 0,
        //     maxShowCount: 20,
        //     showTitle: true,
        //     HTMLAttributes: {
        //         class: 'my-custom-toc'
        //     }
        // }),
        Gapcursor,
        TableKit.configure({
            table: { resizable: true },
        }),
        Mention.configure({
            HTMLAttributes: {
                class: 'mention',
            },
            // suggestion,
        }),
        Emoji.configure({
            emojis: gitHubEmojis,
            enableEmoticons: true,
        }),
        HorizontalRule.configure({
            HTMLAttributes: {
                class: 'my-custom-divider',
            },
        }),
        Indent.configure({
            types: ['paragraph', 'heading'],
            indentSize: 24,
        }),

    ]

    return [
        ...defaultExtensions,
        ...extensions
    ]
}