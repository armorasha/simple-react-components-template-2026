import React, { useEffect, useRef, useState } from 'react';

export default function Select2({ items = [], label, required = false, placeholder = 'Select', onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
    setOpen(false);
    onChange && onChange(item);
  };

  return (
    <div ref={containerRef} className="relative w-full text-sm text-pptx-cream">
      {label && (
        <span className="block mb-1">
          {label}
          {required && <span className="text-pptx-red ml-1">*</span>}
        </span>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-full flex items-center justify-between gap-2 rounded-xl border border-pptx-tan-dark bg-pptx-charcoal-dark px-4 py-2 text-left text-pptx-cream focus:outline-none focus:border-pptx-blue focus:shadow-[inset_0_0_6px_rgba(0,0,0,0.5),0_0_12px_rgba(0,80,140,0.4)]"
      >
        <span className="truncate">{selected ? selected.val : placeholder}</span>
        <svg
          className={`shrink-0 w-[12px] h-[8px] text-pptx-tan transition-transform${open ? ' rotate-180' : ''}`}
          viewBox="0 0 12 8"
          fill="none"
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-pptx-blue/20 bg-pptx-charcoal-dark py-1 shadow-[0_0_20px_rgba(0,80,140,0.3)]">
          {items.map((item) => {
            const isSelected = selected && selected.id === item.id;
            return (
              <li
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
                  isSelected ? 'bg-pptx-blue text-pptx-cream' : 'text-pptx-cream hover:bg-pptx-charcoal-light'
                }`}
              >
                <span className={isSelected ? 'font-semibold' : 'font-normal'}>{item.val}</span>
                {isSelected && <span className="text-pptx-gold">✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
