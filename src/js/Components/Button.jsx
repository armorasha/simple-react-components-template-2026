import React from 'react';

export default function Button({ variant = 'primary', size = 'md', selected, disabled = false, children, ...props }) {
  const toggleable = selected !== undefined;

  return (
    <button
      disabled={disabled}
      aria-pressed={toggleable ? selected : undefined}
      className={`btn btn-${size} btn-${variant}${toggleable ? ' toggleable' : ''}${selected ? ' selected' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
