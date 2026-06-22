import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Editor } from '@tiptap/core';
import { Node as ProseMirrorNode, DOMSerializer } from '@tiptap/pm/model';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import {
  Placement,
  Strategy,
  Middleware,
  VirtualElement
} from '@floating-ui/dom';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const uploadFile = async (file: File, onProgress?: (event: { progress: number }) => void, signal?: AbortSignal) => {
  const formData = new FormData();
  formData.append('file', file);

  // Note: standard fetch cannot track upload progress
  // const response = await fetch('https://example.com', {
  //   method: 'POST',
  //   body: formData,
  //   signal: signal, // Handles cancellation
  // });

  // if (!response.ok) {
  //   throw new Error('Upload failed');
  // }

  // const data = await response.json();
  // return data.url; 

  if (onProgress) {
    onProgress({ progress: 50 });
    onProgress({ progress: 100 });
  }


  // Generate the local object URL
  const objectUrl = URL.createObjectURL(file);

  console.log(objectUrl)

  return objectUrl;
}



export const copySelectedNodeToClipboard = async (editor: Editor | null): Promise<boolean> => {
  if (!editor || !editor.state) {
    console.warn('Tiptap copy operation failed: Editor instance is uninitialized.');
    return false;
  }

  const { selection, doc } = editor.state;
  let targetNode: ProseMirrorNode | null = null;

  if (selection instanceof NodeSelection) {
    targetNode = selection.node;
  } else if (selection instanceof TextSelection) {
    targetNode = selection.$from.parent;
  }

  if (!targetNode || targetNode.type.name === 'doc') {
    console.warn('Tiptap copy operation failed: No copyable block node selected.');
    return false;
  }

  try {
    const schema = editor.schema;
    const serializer = DOMSerializer.fromSchema(schema);
    const domFragment = serializer.serializeNode(targetNode);

    const tempDiv = document.createElement('div');
    tempDiv.appendChild(domFragment);
    const htmlContent = tempDiv.innerHTML;

    const textContent = targetNode.textContent || '';

    const clipboardData = new ClipboardItem({
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
      'text/plain': new Blob([textContent], { type: 'text/plain' }),
    });

    await navigator.clipboard.write([clipboardData]);
    return true;
  } catch (error) {
    console.error('Fatal: Failed to write selected block node to clipboard.', error);
    return false;
  }
};


export const deleteSelectedNode = (editor: Editor | null): boolean => {
  if (!editor || !editor.state) {
    console.warn('Tiptap delete operation failed: Editor instance is uninitialized.');
    return false;
  }

  const { selection } = editor.state;
  let from = selection.from;
  let to = selection.to;

  if (selection instanceof NodeSelection) {
    from = selection.from;
    to = selection.to;
  }
  else if (selection instanceof TextSelection) {
    const depth = selection.$from.depth;

    if (depth === 0) {
      return false;
    }

    from = selection.$from.before(depth);
    to = selection.$from.after(depth);
  }

  return editor
    .chain()
    .deleteRange({ from, to })
    .focus()
    .run();
};


export const duplicateSelectedNode = (editor: Editor | null) => {
  if (!editor || !editor.state) {
    console.warn('Tiptap delete operation failed: Editor instance is uninitialized.');
    return false;
  }
  const { selection } = editor.state;

  // @ts-ignore
  let targetNode = selection?.node;
  let nodePos = selection.from;

  if (!targetNode) {
    targetNode = selection.$from.parent;
    nodePos = selection.$from.before(selection.$from.depth);
  }

  if (targetNode) {
    const insertPosition = nodePos + targetNode.nodeSize;

    editor
      .chain()
      .insertContentAt(insertPosition, targetNode.toJSON())
      .focus()
      .setTextSelection(insertPosition + 1)
      .run();
  }
};



export const setUniversalBlockBackgroundColor = (editor: Editor | null, color: string): boolean => {
  if (!editor || !editor.state) return false;

  const { selection } = editor.state;
  let targetNodeName: string | null = null;
  let nodePos: number | null = null;

  if (selection instanceof NodeSelection) {
    targetNodeName = selection.node.type.name;
    nodePos = selection.from;
  } else if (selection instanceof TextSelection) {
    const depth = selection.$from.depth;
    if (depth > 0) {
      // Intelligently target the direct parent container block node
      targetNodeName = selection.$from.parent.type.name;
      nodePos = selection.$from.before(depth);
    }
  }

  // Execute attribute injection if a safe block target is identified
  if (targetNodeName && nodePos !== null && targetNodeName !== 'doc') {
    return editor
      .chain()
      .focus()
      .updateAttributes(targetNodeName, { universalBgColor: color })
      .run();
  }

  return false;
};



function getSelectionClientRect(editor: Editor | null) {

  if (!editor) return;

  const { from } = editor.state.selection
  const { left, right, top, bottom } = editor.view.coordsAtPos(from)

  return new DOMRect(left, top, right - left, bottom - top)
}



interface UpdatePositionOptions {
  editor?: any; // Replace 'any' with your specific Editor type if using Tiptap, Slate, etc.
  clientRect?: DOMRect | null;
  element: HTMLElement | null;
  placement?: Placement;
  strategy?: Strategy;
  middleware?: Middleware[];
  offsetValue?: number | { mainAxis?: number; crossAxis?: number }; // Adjust based on your offset needs
}


export function updatePosition({
  editor,
  clientRect,
  element,
  placement = 'bottom-start',
  strategy = 'absolute',
  middleware = [shift(), flip()],
  offsetValue,
}: UpdatePositionOptions): Promise<void> | undefined {
  if (!element) {
    return;
  }

  // Assuming getSelectionClientRect returns a DOMRect or null
  const rect = clientRect || (editor ? getSelectionClientRect(editor) : null);

  if (!rect) {
    return;
  }

  const virtualElement: VirtualElement = {
    getBoundingClientRect: () => rect,
  };

  const resolvedMiddleware = offsetValue
    ? [offset(offsetValue), ...middleware]
    : middleware;

  return computePosition(virtualElement, element, {
    placement,
    strategy,
    middleware: resolvedMiddleware,
  }).then(({ x, y, strategy: resolvedStrategy }) => {
    Object.assign(element.style, {
      width: 'max-content',
      position: resolvedStrategy,
      left: `${x}px`,
      top: `${y}px`,
    });
  });
}