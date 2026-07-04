import React from 'react';

export default function Radio({ label, disabled = false, ...props }) {
  return (
    <label className="flex items-center gap-2 text-sm text-pptx-cream cursor-pointer disabled:cursor-not-allowed">
      <input
        type="radio"
        disabled={disabled}
        className="w-4 h-4 accent-pptx-blue disabled:opacity-40 disabled:cursor-not-allowed"
        {...props}
      />
      {label}
    </label>
  );
}
