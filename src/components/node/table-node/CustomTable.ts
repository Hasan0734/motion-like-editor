import { mergeAttributes } from "@tiptap/core";
import { createColGroup, Table } from "@tiptap/extension-table";
import { DOMOutputSpec, DOMSerializer } from "@tiptap/pm/model";
import { cn } from "~/lib/utils";

export const CustomTable = Table.extend({
    renderHTML({ node, HTMLAttributes }) {
        const { colgroup, tableWidth, tableMinWidth } = createColGroup(node, this.options.cellMinWidth);

        const table: DOMOutputSpec = [
            "div",
            {
                class: cn("tableWrapper")
            },
            "table",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                style: tableWidth ? `width: ${tableWidth}` : `min-width: ${tableMinWidth}`
            }),
            colgroup,
            ['table', 0]
        ]
        return table;
    },
    addNodeView() {
        return ({ node, HTMLAttributes }) => {
            const { colgroup, tableWidth, tableMinWidth } = createColGroup(node, this.options.cellMinWidth)

            const dom = document.createElement("div");
            dom.setAttribute('data-content-type', 'table');
            dom.className = cn('mb-4');
            const wrapper = document.createElement("div");
            wrapper.className = cn("tableWrapper")

            const tableContainer = document.createElement("div");
            tableContainer.className = "table-container";

            const table = document.createElement('table');

            Object.entries(this.options.HTMLAttributes).forEach(([key, value]) => {
                table.setAttribute(key, value)
            })

            Object.entries(HTMLAttributes).forEach(([key, value]) => {
                table.setAttribute(key, value)
            })

            table.style.width = tableWidth;
            table.style.minWidth = tableMinWidth;

            const colGroup = DOMSerializer.renderSpec(document, colgroup);

            const content = document.createElement("tbody");
            table.append(colGroup.dom, content);

            tableContainer.append(table);

            const tableControls = document.createElement("div");
            tableControls.className = 'table-controls';

            const tableSelectionContainer = document.createElement("div");
            tableSelectionContainer.className = 'table-selection-container';

            wrapper.append(tableContainer, tableControls, tableSelectionContainer)

            dom.append(wrapper);

            return {
                dom: dom,
                contentDOM: content,
                ignoreMutation: (_mutation) => {
                    return true;
                }
            }
        }
    }
})