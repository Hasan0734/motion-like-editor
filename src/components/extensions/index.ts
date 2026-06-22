import { Placeholder } from '@tiptap/extension-placeholder';
import { AnyExtension } from "@tiptap/core";
import { BlockGroupItem } from "../blocks/types";
import { SlashCommand } from "./slash-command/slash-command";
import suggestion from "./slash-command/suggestion";
import { ListKit } from '@tiptap/extension-list'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { TableOfContents } from '@tiptap/extension-table-of-contents'
import { Gapcursor, Dropcursor } from '@tiptap/extensions'
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
import emojiSuggestion from './emoji-picker/emoji-suggestion';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { TrailingNode } from '@tiptap/extensions'
import Blockquote from '@tiptap/extension-blockquote'
import { all, createLowlight } from 'lowlight'
import { FileHandlerExtension } from './file-handle';
import { CustomImage } from '../node/image/CustomImage';
import UniqueID from '@tiptap/extension-unique-id'
import { ImageUploadNode } from '../node/image-upload';
import { Mathematics } from '@tiptap/extension-mathematics'
import { CustomTableKit } from '../node/table-node/table-kit';
import { GlobalBlockBackground } from './global-block-background';
import suggestionConfig from './mention/mentionSuggestion';

// import css from 'highlight.js/lib/languages/css'

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all)

// lowlight.register('css', css)

type ExtensionProps = {
    extensions?: AnyExtension[];
    blocks: BlockGroupItem[] | undefined
}

export function extensions(props: ExtensionProps) {
    const { blocks, extensions = [] } = props;

    const defaultExtensions = [
      
        Mathematics.configure({
            inlineOptions: {
                // optional options for the inline math node
            },
            blockOptions: {
                // optional options for the block math node
            },
            katexOptions: {
                // optional options for the KaTeX renderer
            },
        }),
        UniqueID.configure({
            types: "all",
        }),
        Blockquote,
        TrailingNode,
        // Image,
        CustomImage,
        ImageUploadNode,
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
        GlobalBlockBackground,
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

        Gapcursor,
        Dropcursor.configure({
            class: "transition-all duration-300 ease-out"
        }),
        CustomTableKit,

        Mention.configure({
            HTMLAttributes: {
                class: 'mention',
            },
            suggestion: suggestionConfig,
        }),
        Emoji.configure({
            emojis: gitHubEmojis,
            enableEmoticons: true,

            suggestion: emojiSuggestion,

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
        CodeBlockLowlight.configure({
            lowlight,
        }),
        FileHandlerExtension,
    ]

    return [
        ...defaultExtensions,
        ...extensions
    ]
}