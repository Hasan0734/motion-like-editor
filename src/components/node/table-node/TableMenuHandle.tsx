import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  TableMenuHandlePlugin,
  TableMenuHandlePluginProps,
} from "./plugins/table-menu-handle-plugin";

export interface TableMenuHandleProps {
  ref?: React.ForwardedRef<HTMLDivElement>;
  children: React.ReactNode;
  pluginProps: Omit<TableMenuHandlePluginProps, "element">;
}

export const TableMenuHandle = ({
  ref,
  children,
  pluginProps,
}: TableMenuHandleProps) => {
  const rootElementRef = useRef(document.createElement("div"));

  useEffect(() => {
    if (typeof ref === "function") {
      ref(rootElementRef.current);
    } else if (ref) {
      ref.current = rootElementRef.current;
    }
  }, [ref]);

  useEffect(() => {
    const editor = pluginProps.editor;
    const rootElement = rootElementRef.current;

    rootElement.style.visibility = "hidden";
    rootElement.style.position = "absolute";

    if (editor.isDestroyed) {
      return;
    }

    const plugin = TableMenuHandlePlugin({
      ...pluginProps,
      element: rootElement,
    });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin(pluginProps.pluginKey);
      window.requestAnimationFrame(() => {
        if (rootElement.parentNode) {
          rootElement.parentNode.removeChild(rootElement);
        }
      });
    };
  }, [pluginProps]);

  return createPortal(<>{children}</>, rootElementRef.current);
};
