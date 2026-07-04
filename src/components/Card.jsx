import React from 'react';

export default function Card({ title, children }) {
  return (
    <div className="bg-pptx-charcoal-light/70 backdrop-blur-md border border-pptx-blue/20 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,80,140,0.08)]">
      {title && <h3 className="text-pptx-gold text-lg font-extralight mb-3 tracking-wide">{title}</h3>}
      {children}
    </div>
  );
}
