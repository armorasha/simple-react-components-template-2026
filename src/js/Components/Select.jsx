import React from 'react';

export default function Select({ label, options = [], disabled = false, ...props }) {
  return (
    <label className="field-label">
      {label && <span>{label}</span>}
      <select
        disabled={disabled}
        className="field-input select-input"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-pptx-charcoal-dark text-pptx-cream">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
