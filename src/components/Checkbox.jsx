import React from 'react';

export default function Checkbox({ label, disabled = false, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-pptx-cream cursor-pointer disabled:cursor-not-allowed">
      <input
        type="checkbox"
        disabled={disabled}
        className="w-4 h-4 rounded accent-pptx-blue disabled:opacity-40 disabled:cursor-not-allowed"
        {...props}
      />
      {label}
    </label>
  );
}
