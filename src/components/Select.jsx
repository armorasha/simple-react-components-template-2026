import React from 'react';

export default function Select({ label, options = [], disabled = false, ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-pptx-cream">
      {label && <span>{label}</span>}
      <select
        disabled={disabled}
        className="bg-pptx-charcoal-dark border border-pptx-tan-dark rounded-xl px-4 py-2 text-pptx-cream focus:outline-none focus:border-pptx-blue focus:shadow-[inset_0_0_6px_rgba(0,0,0,0.5),0_0_12px_rgba(0,80,140,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
