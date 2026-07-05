import React, { useState } from 'react';

export default function SquareButton({ variant = 'primary', defaultSelected = false, disabled = false, children }) {
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <button
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => setSelected((v) => !v)}
      className={`square-btn square-btn-${variant}${selected ? ' selected' : ''}`}
    >
      {children}
    </button>
  );
}
