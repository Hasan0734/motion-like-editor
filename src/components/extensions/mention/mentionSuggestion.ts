import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import MentionList, { DropdownMenuRef } from './MentionList'; 
import { updatePosition } from '~/lib/utils';

const allItems: string[] = [
    'Lea Thompson',
    'Cyndi Lauper',
    'Tom Cruise',
    'Madonna',
    'Jerry Hall',
    'Joan Collins',
    'Winona Ryder',
    'Christina Applegate',
    'Alyssa Milano',
    'Molly Ringwald',
    'Ally Sheedy',
    'Debbie Harry',
    'Olivia Newton-John',
    'Elton John',
    'Michael J. Fox',
    'Axl Rose',
    'Emilio Estevez',
    'Ralph Macchio',
    'Rob Lowe',
    'Jennifer Grey',
    'Mickey Rourke',
    'John Cusack',
    'Matthew Broderick',
    'Justine Bateman',
    'Lisa Bonet',
];

// Defining explicit suggestion configuration types
const suggestionConfig: Omit<SuggestionOptions<string>, 'editor'> & {
    debounce?: number;
    initialItems?: string[];
} = {
    items: async ({ query }) => {
        // Simulate an async API call
        await new Promise(resolve => {
            setTimeout(resolve, 300);
        });

        return allItems
            .filter(item => item.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
    },

    debounce: 300,
    initialItems: ['Lea Thompson', 'Cyndi Lauper', 'Tom Cruise'],
    render: () => {
        // Explicitly type the ReactRenderer to include your custom component structure
        let component: ReactRenderer<DropdownMenuRef, SuggestionProps<string>>;

        return {
            onStart: (props: SuggestionProps<string>) => {
                component = new ReactRenderer(MentionList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
                    return;
                }

                component.element.style.position = 'absolute';
                document.body.appendChild(component.element);

                updatePosition({
                    editor: props.editor,
                    element: component.element,
                    clientRect: props.clientRect()
                });
            },

            onUpdate(props: SuggestionProps<string>) {
                component.updateProps(props);

                if (!props.clientRect) {
                    return;
                }

                updatePosition({
                    editor: props.editor,
                    element: component.element,
                    clientRect: props.clientRect()
                });
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    component.destroy();
                    return true;
                }

                // Purely typed! No more `@ts-ignore` required.
                return component.ref?.onKeyDown(props) ?? false;
            },

            onExit() {
                component.element.remove();
                component.destroy();
            },
        };
    },
};

export default suggestionConfig;