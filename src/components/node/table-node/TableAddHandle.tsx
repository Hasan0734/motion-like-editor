// import { ReactRenderer } from "@tiptap/react";
// import { useEffect, useRef } from "react";

// export function TableAddHandle({
//   children,
//   pluginProps,
// }: TableAddHandleProps) {
  
//     useEffect(() => {
//       if (typeof ref === "function") {
//         ref(rootElementRef.current);
//       } else if (ref) {
//         ref.current = rootElementRef.current;
//       }
//     }, [ref]);
  
//     useEffect(() => {
//       const editor = pluginProps.editor;
//       const rootElement = rootElementRef.current;
  
//       rootElement.style.visibility = "hidden";
//       rootElement.style.position = "absolute";
  
//       if (editor.isDestroyed) {
//         return;
//       }
  
//       const plugin = AddColumnPlugin({
//         ...pluginProps,
//         element: rootElement,
//       });
  
//       editor.registerPlugin(plugin);
  
//       return () => {
//         editor.unregisterPlugin(pluginProps.pluginKey);
//         window.requestAnimationFrame(() => {
//           if (rootElement.parentNode) {
//             rootElement.parentNode.removeChild(rootElement);
//           }
//         });
//       };
//     }, [pluginProps]);
  
//     return createPortal(<>{children}</>, rootElementRef.current);

//   return null;
// }