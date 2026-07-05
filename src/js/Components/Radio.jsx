import React from 'react';

export default function Radio({ label, disabled = false, ...props }) {
  return (
    <label className="check-label">
      <input
        type="radio"
        disabled={disabled}
        className="radio-input"
        {...props}
      />
      {label}
    </label>
  );
}
