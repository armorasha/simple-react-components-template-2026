import React from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-panel">
        <div className="flex items-start justify-between mb-4">
          <h3 className="modal-title">{title}</h3>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="flex justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
