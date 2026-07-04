import React from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-pptx-charcoal-light border border-pptx-blue/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,80,140,0.2)]">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-pptx-gold text-lg font-extralight tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="text-pptx-tan hover:text-pptx-cream transition-colors leading-none text-xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="text-pptx-cream text-sm mb-6">{children}</div>
        {footer && <div className="flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
