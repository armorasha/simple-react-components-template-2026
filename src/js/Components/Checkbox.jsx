import React from 'react';

export default function Checkbox({ label, disabled = false, ...props }) {
  return (
    <label className="check-label">
      <input
        type="checkbox"
        disabled={disabled}
        className="checkbox-input"
        {...props}
      />
      {label}
    </label>
  );
}
