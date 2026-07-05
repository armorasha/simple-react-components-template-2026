import React, { useState } from 'react';

const VARIANT_CLASSES = {
  primary: {
    base: 'bg-pptx-blue border-pptx-blue-light/60 text-pptx-cream shadow-[0_0_20px_rgba(0,80,140,0.6)] hover:shadow-[0_0_28px_rgba(0,80,140,0.8)]',
    selected: 'bg-pptx-blue-dark border-pptx-blue-dark/60 text-pptx-cream-dark shadow-[inset_0_4px_10px_rgba(0,0,0,0.7)]',
  },
  secondary: {
    base: 'bg-pptx-tan border-pptx-tan-light/60 text-pptx-charcoal shadow-[0_0_20px_rgba(122,140,163,0.5)] hover:shadow-[0_0_28px_rgba(122,140,163,0.7)]',
    selected: 'bg-pptx-tan-dark border-pptx-tan-dark/60 text-pptx-charcoal-dark shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]',
  },
  success: {
    base: 'bg-pptx-green border-pptx-green-light/60 text-pptx-cream shadow-[0_0_20px_rgba(23,130,77,0.6)] hover:shadow-[0_0_28px_rgba(23,130,77,0.8)]',
    selected: 'bg-pptx-green-dark border-pptx-green-dark/60 text-pptx-cream-dark shadow-[inset_0_4px_10px_rgba(0,0,0,0.7)]',
  },
  danger: {
    base: 'bg-pptx-red border-pptx-red-light/60 text-pptx-cream shadow-[0_0_20px_rgba(147,21,21,0.6)] hover:shadow-[0_0_28px_rgba(147,21,21,0.8)]',
    selected: 'bg-pptx-red-dark border-pptx-red-dark/60 text-pptx-cream-dark shadow-[inset_0_4px_10px_rgba(0,0,0,0.7)]',
  },
};

export default function SquareButton({ variant = 'primary', defaultSelected = false, disabled = false, children }) {
  const [selected, setSelected] = useState(defaultSelected);
  const stateClasses = selected ? VARIANT_CLASSES[variant].selected : VARIANT_CLASSES[variant].base;

  return (
    <button
      disabled={disabled}
      aria-pressed={selected}
      onClick={() => setSelected((v) => !v)}
      className={`h-24 w-24 rounded-2xl border-4 font-semibold text-xs uppercase tracking-wide transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${stateClasses}`}
    >
      {children}
    </button>
  );
}
