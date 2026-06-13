import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import { Extension } from "@tiptap/core";


export type SlashCommandOptions = {
    suggestion: Omit<SuggestionOptions, 'editor'>
}

const SlashCommand = Extension.create<SlashCommandOptions>({
    name: "slash-command",
    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }) => {
                    props.command({ editor, range })
                },
                decorationTag: "Filters",
                decorationContent: "Filters",
                decorationClass: 'bg-secondary outline-[5.5px] outline-secondary px-px rounded after:text-muted-foreground',
                decorationEmptyClass: "after:content-['Filters...']"
            }
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion
            })
        ]
    }

})



export { SlashCommand }