import React, { useState } from 'react';

export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="accordion-item">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="accordion-header"
              aria-expanded={isOpen}
            >
              <span className="font-normal">{item.title}</span>
              <svg
                className={`shrink-0 w-[12px] h-[8px] text-pptx-tan transition-transform${isOpen ? ' rotate-180' : ''}`}
                viewBox="0 0 12 8"
                fill="none"
              >
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isOpen && <div className="accordion-panel">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
