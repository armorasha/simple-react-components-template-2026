import React from 'react';

const STATUS_CLASSES = {
  info: 'bg-pptx-blue text-pptx-cream shadow-[0_0_10px_rgba(0,80,140,0.5)]',
  warning: 'bg-pptx-amber text-pptx-charcoal shadow-[0_0_10px_rgba(255,119,0,0.5)]',
  critical: 'bg-pptx-red text-pptx-cream shadow-[0_0_10px_rgba(147,21,21,0.5)]',
  success: 'bg-pptx-green text-pptx-cream shadow-[0_0_10px_rgba(23,130,77,0.5)]',
  neutral: 'bg-pptx-tan text-pptx-charcoal',
};

export default function Badge({ status = 'neutral', children }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-normal ${STATUS_CLASSES[status]}`}>
      {children}
    </span>
  );
}
