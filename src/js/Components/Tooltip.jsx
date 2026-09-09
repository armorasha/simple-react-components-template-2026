import { useState } from "react";
import CursorTooltip from "./CursorTooltip";

export default function Tooltip({ label, children }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
    >
      {children}
      <CursorTooltip x={pos.x} y={pos.y} content={label} visible={visible} />
    </span>
  );
}
