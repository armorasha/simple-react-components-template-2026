import React from 'react';

export default function Slider({ label, min = 0, max = 100, value, onChange, disabled = false }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-pptx-cream w-full">
      {label && (
        <span className="flex justify-between">
          <span>{label}</span>
          <span className="text-pptx-tan">{value}</span>
        </span>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full accent-pptx-blue disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </label>
  );
}
