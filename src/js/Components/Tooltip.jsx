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
        <span className="tooltip-bubble">
          {label}
        </span>
      )}
    </span>
  );
}
