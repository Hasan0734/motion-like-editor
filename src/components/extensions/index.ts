import { Placeholder } from '@tiptap/extension-placeholder';
import { AnyExtension } from "@tiptap/core";
import { baseKit } from "./base-kit";
import { BlockGroupItem } from "../blocks/types";
import { SlashCommand } from "./slash-command";
import suggestion from "./suggestion";
import { BulletList, ListItem, ListKit, OrderedList } from '@tiptap/extension-list'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { getHierarchicalIndexes, TableOfContents } from '@tiptap/extension-table-of-contents'
import { TableKit } from '@tiptap/extension-table'
import { Gapcursor } from '@tiptap/extensions'
import { Document } from '@tiptap/extension-document'
import { Mention } from '@tiptap/extension-mention'
import Emoji, { gitHubEmojis } from '@tiptap/extension-emoji'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { TocNode } from './toc-node/TocNode';
import {v4 as uuidv4} from 'uuid'

type ExtensionProps = {
    extensions?: AnyExtension[];
    blocks: BlockGroupItem[] | undefined
}

export function extensions(props: ExtensionProps) {
    const { blocks, extensions = [] } = props;

    const defaultExtensions = [
        Document,
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
            getId: () => uuidv4(),
            onUpdate(content) {
                console.log(content.map((item) => item.isActive))
                console.log(content.map((item) => item.isScrolledOver))

            }
            

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
                class: 'my-custom-divider', // Optional: add custom tailwind/CSS classes
            },
        }),
        
    ]

    return [
        ...defaultExtensions,
        ...extensions
    ]
}