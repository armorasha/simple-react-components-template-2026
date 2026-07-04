import React from 'react';

const VARIANT_CLASSES = {
  primary: {
    base:
      'bg-pptx-blue hover:bg-pptx-blue-light active:bg-pptx-blue-dark text-pptx-cream shadow-[0_0_16px_rgba(0,80,140,0.45)] hover:shadow-[0_0_24px_rgba(0,80,140,0.65)] active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.7)]',
    selected:
      'bg-pptx-blue text-pptx-cream-dark [text-shadow:0_1px_1px_rgba(0,0,0,0.4)] shadow-[inset_0_0_8px_rgba(0,0,0,0.8),0_0_12px_rgba(0,80,140,0.35)]',
  },
  secondary: {
    base:
      'bg-pptx-tan hover:bg-pptx-tan-light active:bg-pptx-tan-dark text-pptx-charcoal shadow-[0_0_16px_rgba(122,140,163,0.45)] hover:shadow-[0_0_24px_rgba(122,140,163,0.65)] active:shadow-[inset_0_2px_2px_rgba(0,0,0,0.6)]',
    selected:
      'bg-pptx-tan-dark text-pptx-charcoal-dark [text-shadow:0_1px_1px_rgba(255,255,255,0.1)] shadow-[inset_0_0_8px_rgba(0,0,0,0.65),0_0_12px_rgba(122,140,163,0.35)]',
  },
  danger: {
    base:
      'bg-pptx-red hover:bg-pptx-red-light active:bg-pptx-red-dark text-pptx-cream shadow-[0_0_16px_rgba(147,21,21,0.45)] hover:shadow-[0_0_24px_rgba(147,21,21,0.65)] active:shadow-[inset_0_3px_10px_rgba(0,0,0,0.7)]',
    selected:
      'bg-pptx-red text-pptx-cream-dark/70 [text-shadow:0_1px_1px_rgba(0,0,0,0.4)] shadow-[inset_0_0_8px_rgba(0,0,0,0.8),0_0_12px_rgba(147,21,21,0.35)]',
  },
};

const SIZE_CLASSES = {
  md: 'px-5 py-2.5 text-base rounded-xl',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
};

export default function Button({ variant = 'primary', size = 'md', selected = false, disabled = false, children, ...props }) {
  const stateClasses = selected ? VARIANT_CLASSES[variant].selected : VARIANT_CLASSES[variant].base;

  return (
    <button
      disabled={disabled}
      aria-pressed={selected}
      className={`font-sans font-light transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${SIZE_CLASSES[size]} ${stateClasses}`}
      {...props}
    >
      {children}
    </button>
  );
}
