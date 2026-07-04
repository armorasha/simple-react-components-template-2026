import React, { useState } from 'react';

export default function Tooltip({ label, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-lg bg-pptx-charcoal-dark border border-pptx-blue/30 px-2.5 py-1 text-xs text-pptx-cream shadow-[0_0_12px_rgba(0,80,140,0.35)] z-10">
          {label}
        </span>
      )}
    </span>
  );
}
