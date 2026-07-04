import React from 'react';

export default function Toggle({ label, checked, onChange, disabled = false }) {
  return (
    <label className="flex items-center gap-3 text-sm text-pptx-cream cursor-pointer">
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-lg transition-colors ${
          checked
            ? 'bg-pptx-blue shadow-[inset_0_0_6px_rgba(0,0,0,0.55),0_0_12px_rgba(0,80,140,0.55)]'
            : 'bg-pptx-charcoal-dark shadow-[0_0_10px_rgba(0,80,140,0.3)]'
        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-md bg-pptx-cream transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
      {label}
    </label>
  );
}
