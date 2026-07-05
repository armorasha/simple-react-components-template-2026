import React from 'react';

const DOT_CLASSES = {
  info: 'bg-pptx-blue shadow-[0_0_12px_2px_rgba(0,80,140,0.85)]',
  warning: 'bg-pptx-amber shadow-[0_0_12px_2px_rgba(255,119,0,0.85)]',
  critical: 'bg-pptx-red shadow-[0_0_12px_2px_rgba(147,21,21,0.85)]',
  success: 'bg-pptx-green shadow-[0_0_12px_2px_rgba(23,130,77,0.85)]',
  neutral: 'bg-pptx-tan shadow-[0_0_10px_2px_rgba(122,140,163,0.7)]',
};

const SIZE_CLASSES = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2.5 w-2.5',
};

export default function StatusLight({ status = 'neutral', size = 'md', children }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-pptx-cream">
      <span className={`rounded-full ${SIZE_CLASSES[size]} ${DOT_CLASSES[status]}`} />
      {children}
    </span>
  );
}
