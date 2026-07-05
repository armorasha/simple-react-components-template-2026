import React from 'react';

export default function TextInput({ label, disabled = false, ...props }) {
  return (
    <label className="field-label">
      {label && <span>{label}</span>}
      <input
        disabled={disabled}
        className="field-input"
        {...props}
      />
    </label>
  );
}
