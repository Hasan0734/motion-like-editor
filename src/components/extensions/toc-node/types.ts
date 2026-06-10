import { Editor } from "@tiptap/core"

export type Anchors = {
    dom: HTMLElement
    editor: Editor
    id: string
    isActive: boolean
    isScrolledOver: boolean
    itemIndex: number
    level: number
    node: Node
    originalLevel: number
    pos: number
    textContent: string
}