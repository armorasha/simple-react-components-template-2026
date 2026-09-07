import { useLayoutEffect, useRef, useState } from "react";

const CURSOR_OFFSET = 14;

// Generic cursor-anchored tooltip: caller supplies {x, y} and content
// (string or any JSX), this component only owns where to render it.
// Always measures its own size after render and flips horizontally/
// vertically off the cursor independently so it never runs off-screen —
// never assume a fixed corner works everywhere on the page.
//
// `anchor` picks the coordinate space:
// - "fixed" (default) — x/y are viewport coordinates (e.g. from a
//   MouseEvent's clientX/clientY), edges checked against
//   window.innerWidth/innerHeight. Works from anywhere on the page.
// - "absolute" — x/y are relative to the nearest positioned ancestor
//   (e.g. deck.gl's onHover x/y, which are canvas-relative), edges
//   checked against that ancestor's own size. The caller must render this
//   inside a `position: relative` container sized to match — no
//   getBoundingClientRect()-based conversion needed, avoids a whole class
//   of viewport-offset bugs.
export default function CursorTooltip({
  x,
  y,
  content,
  visible = true,
  anchor = "fixed",
}) {
  const elRef = useRef(null);
  const [placement, setPlacement] = useState({ left: 0, top: 0 });

  const shown = visible && content != null && x != null && y != null;

  useLayoutEffect(() => {
    if (!shown || !elRef.current) {
      return;
    }
    const { width, height } = elRef.current.getBoundingClientRect();
    const bounds =
      anchor === "absolute"
        ? elRef.current.offsetParent?.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
    const boundsWidth = bounds?.width ?? window.innerWidth;
    const boundsHeight = bounds?.height ?? window.innerHeight;

    const overflowsRight = x + CURSOR_OFFSET + width > boundsWidth;
    const left = overflowsRight ? x - CURSOR_OFFSET - width : x + CURSOR_OFFSET;

    const overflowsBottom = y + CURSOR_OFFSET + height > boundsHeight;
    const top = overflowsBottom
      ? y - CURSOR_OFFSET - height
      : y + CURSOR_OFFSET;

    setPlacement({ left, top });
  }, [shown, x, y, content, anchor]);

  if (!shown) {
    return null;
  }

  return (
    <span
      ref={elRef}
      className={`${anchor === "absolute" ? "absolute" : "fixed"} z-50 pointer-events-none bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg`}
      style={{ left: placement.left, top: placement.top }}
    >
      {content}
    </span>
  );
}
