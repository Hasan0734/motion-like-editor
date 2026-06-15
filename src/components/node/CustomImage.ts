import Image from '@tiptap/extension-image'
import { mergeAttributes, NodePos, NodeViewProps, ReactNodeViewRenderer, ResizableNodeView } from '@tiptap/react'
import ImageNodeView from './ImageNodeView'
import { HTMLAttributes } from 'react'

export const CustomImage = Image.extend({
    draggable: true,
    addAttributes() {
        return {
            ...this.parent?.(),
            alignment: {
                default: 'center',

            }
        }
    },

    addNodeView() {
        // return ({node, getPos, HTMLAttributes}) => {
        //     return new ResizableNodeView(ImageNodeView)
        // }

        return ReactNodeViewRenderer(ImageNodeView, {
            className: "not-prose min-h-10",
            attrs: { 'data-placeholder': "Start writing...", },
        })
    },



})
