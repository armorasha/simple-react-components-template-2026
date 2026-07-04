import React, { useState } from 'react';

export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="rounded-xl border border-pptx-blue/15 overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-pptx-cream bg-pptx-charcoal-dark hover:bg-pptx-charcoal-light transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-normal">{item.title}</span>
              <span className={`text-pptx-tan transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
            </button>
            {isOpen && <div className="px-4 py-3 text-sm text-pptx-tan bg-pptx-charcoal">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
