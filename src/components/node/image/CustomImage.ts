import Image from '@tiptap/extension-image'
import { mergeAttributes, NodePos, NodeViewProps, ReactNodeViewRenderer, ResizableNodeView } from '@tiptap/react'
import ImageNodeView from './ImageNodeView'
import { HTMLAttributes } from 'react'

export const CustomImage = Image.extend({
    draggable: true,
    // group: "block",
    // content: "inline+",
    // atom: true,
    addAttributes() {
        return {
            ...this.parent?.(),
            alignment: {
                default: 'center',

            },
            'data-width': {
                default: 0
            },

            width: {
                default: 0,
                parseHTML: element => {
                    const val = element.getAttribute('data-width') || element.style.width;
                    return val ? parseInt(val, 10) : 0
                },
                renderHTML: attributes => {
                    return attributes['data-width']
                }
            },
            
            // height: {
            //     default: 0,
            //     parseHTML: element => element.getAttribute('height') || parseInt(element.style.height, 10) || null,
            //     renderHTML: attributes => {
            //         if (!attributes) return {};
            //         return { height: attributes.height }
            //     }
            // },
            // aspectRatio: {
            //     default: null,
            //     parseHTML: element => element.getAttribute('data-aspect-ratio') || null,
            //     renderHTML: attributes => {
            //         if (!attributes.aspectRatio) return {};
            //         return { 'data-aspect-ratio': attributes.aspectRatio }
            //     }
            // }
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
