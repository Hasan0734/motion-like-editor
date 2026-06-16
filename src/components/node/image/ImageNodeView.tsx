import React, { CSSProperties, useCallback, useRef, useState } from "react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useEvent } from "~/lib/use-event";
import { getAspectRatio, getNewHeight } from "~/lib/aspect-ratio";

const MIN_WIDTH = 20;
export const IMAGE_MAX_WIDTH = 600;
export const IMAGE_MAX_HEIGHT = 400;

export default function ImageNodeView({
  node,
  editor,
  updateAttributes,
  getPos,
}: NodeViewProps) {
  const { src, alignment, width: nodeWidth, height: nodeHeight } = node.attrs;
  const [isHovered, setIsHovered] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  // Change ref type back to HTMLDivElement since it targets the container div
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = useEvent(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!imgRef.current || !containerRef.current) return;

      event.preventDefault();
      event.stopPropagation();

      const maxAllowedWidth = wrapperRef.current?.parentElement
        ? wrapperRef.current.parentElement.offsetWidth
        : IMAGE_MAX_WIDTH;

      const direction = event.currentTarget.dataset.direction || "--";
      const initialXPosition = event.clientX;
      const initialYPosition = event.clientY;

      const currentWidth = imgRef.current.offsetWidth;
      const currentHeight = imgRef.current.offsetHeight;

      let newWidth = currentWidth;
      let newHeight = currentHeight;

      const transformX = direction.charAt(1) === "w" ? -1 : 1;
      const transformY = direction.charAt(0) === "n" ? -1 : 1;

      const removeListeners = () => {
        window.removeEventListener("mousemove", mouseMoveHandler, {
          capture: true,
        });
        window.removeEventListener("mouseup", removeListeners, {
          capture: true,
        });

        const aspectRatio = getAspectRatio(newWidth, newHeight);

        // Finalize state change inside Tiptap schema model
        updateAttributes({ width: newWidth, height: newHeight, aspectRatio });
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        newWidth = Math.max(
          currentWidth + transformX * (event.clientX - initialXPosition),
          MIN_WIDTH,
        );
        newHeight = Math.max(
          currentHeight + transformY * (event.clientY - initialYPosition),
          MIN_WIDTH,
        );

        if (newWidth > maxAllowedWidth) newWidth = maxAllowedWidth;
        if (newHeight > IMAGE_MAX_HEIGHT) newHeight = IMAGE_MAX_HEIGHT;

        if (node.attrs.lockAspectRatio) {
          const aspectRatio =
            node.attrs.aspectRatio &&
            isFinite(node.attrs.aspectRatio) &&
            node.attrs.aspectRatio > 0
              ? node.attrs.aspectRatio
              : currentWidth / currentHeight;
          newHeight = getNewHeight(newWidth, aspectRatio);
        }

        if (containerRef.current) {
          containerRef.current.style.width = `${newWidth}px`;
          // Update attribute dynamically for CSS selection targeting
          wrapperRef.current?.setAttribute("data-width", String(newWidth));
        }

        if (!event.buttons) {
          return removeListeners();
        }
      };

      window.addEventListener("mousemove", mouseMoveHandler, { capture: true });
      window.addEventListener("mouseup", removeListeners, { capture: true });
    },
  );

  // 1. Calculate the final computed width value
  const finalWidth = nodeWidth ? `${nodeWidth}px` : "auto";

  return (
    <NodeViewWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="tiptap-image transition-all duration-200 select-none"
      data-align={alignment}
      data-width={nodeWidth || nodeWidth} // Handled via data attributes
      ref={wrapperRef}
    >
      <div
        className="tiptap-image-container"
        style={{ width: finalWidth }}
        ref={containerRef}
      >
        <div className="tiptap-image-content relative" >
          <img
            data-drag-handle
            ref={imgRef}
            contentEditable={false}
            draggable={false}
            className="tiptap-image-img cursor-pointer"
            src={src}
            alt="example"
            onDragStart={(e) => e.preventDefault()}
            style={
              {
                height: "auto",
                display: "block",
                userSelect: "none",
                WebkitUserDrag: "none",
              } as CSSProperties
            } // Make image follow container width
          />
          {isHovered && (
            <>
              <div
                onMouseDown={handleMouseDown}
                data-direction="-w"
                className="tiptap-image-handle tiptap-image-handle-left"
              ></div>
              <div
                onMouseDown={handleMouseDown}
                data-direction="-e"
                className="tiptap-image-handle tiptap-image-handle-right"
              ></div>
            </>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}

// const handleReplaceClick = () => {
//   const currentPosition = typeof getPos === "function" ? getPos() : null;
//   if (currentPosition === null || currentPosition == undefined) {
//     return;
//   }

//   editor
//     .chain()
//     .focus()
//     .deleteRange({
//       from: currentPosition,
//       to: currentPosition + node.nodeSize,
//     })
//     .insertContentAt(currentPosition, {
//       type: "imageUpload",
//     })
//     .run();
// };
