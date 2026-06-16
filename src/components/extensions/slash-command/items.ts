import {
    blockquote,
    heading1,
    heading2,
    heading3,
    text,
} from "../../blocks/typography";
import { bulletList, orderedList, taskList } from "../../blocks/list";
import { htmlCodeBlock } from "../../blocks/code";
import { table } from "../../blocks/table";
import { mention } from "../../blocks/mention";
import { emoji } from "../../blocks/emoji";
import { separator } from "../../blocks/separator";
import { tableOfContents } from "../../blocks/tableOfContents";
import { uploadImage } from "~/components/blocks/image";

export const blockItems = [
    {
        title: "AI",
        commands: [
            heading3,
            bulletList,
            orderedList,
            blockquote,
            htmlCodeBlock
        ]
    },
    {
        title: "Style",
        commands: [
            text,
            heading1,
            heading2,
            heading3,
            bulletList,
            orderedList,
            taskList,
            blockquote,
            htmlCodeBlock
        ]
    },
    {
        title: "Insert",
        commands: [
            mention,
            emoji,
            table,
            separator,
            tableOfContents
        ]
    },
    {
        title: "Upload",
        commands: [
            uploadImage,

        ]
    }
]