import { Extension } from '@tiptap/core';
import { Table, TableRow, TableCell, TableHeader, TableView } from '@tiptap/extension-table';

const CustomTableNode = Table.extend({


    addAttributes() {
        return {
            ...this.parent?.(),
            contentType: {
                default: 'table',
                parseHTML: element => element.getAttribute('data-content-type'),
                renderHTML: attributes => ({ 'data-content-type': attributes.contentType }),
            },
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => ({ 'data-id': attributes.id }),
            },
        };
    },
    parseHTML() {
        return [{ tag: 'div[data-content-type="table"]' }];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            {
                'data-content-type': HTMLAttributes['data-content-type'] || 'table',
                'data-id': HTMLAttributes['data-id'] || '',
            },
            [
                'div',
                { class: 'tableWrapper' },
                [
                    'div',
                    { class: 'table-container' },
                    [
                        'table',
                        {
                            style: HTMLAttributes.style || '--default-cell-min-width: 120px;',
                            class: HTMLAttributes.class,
                        },
                        0, // Prosemirror injects <colgroup> and <tbody> content here
                    ],
                ],
            ],
        ];
    },

    addNodeView() {
        return ({ node, cellMinWidth }) => {
            const tableView = new TableView(node, cellMinWidth)

            const root = document.createElement('div')
            root.setAttribute(
                'data-content-type',
                node.attrs.contentType || 'table'
            )

            const wrapper = document.createElement('div')
            wrapper.className = 'tableWrapper'

            const container = document.createElement('div')
            container.className = 'table-container'

            container.appendChild(tableView.dom)
            wrapper.appendChild(container)
            root.appendChild(wrapper)

            return {
                dom: root,
                contentDOM: tableView.contentDOM,
                update: tableView.update?.bind(tableView),
                ignoreMutation: tableView.ignoreMutation?.bind(tableView),
                destroy: tableView.destroy?.bind(tableView),
            }
        }
    },
})


export const TableNodeExtension = Extension.create({
    name: 'customTableKit',

    addExtensions() {
        return [
            CustomTableNode.configure({
                resizable: true
            }),
            TableRow,
            TableCell,
            TableHeader,
        ];
    },
});


