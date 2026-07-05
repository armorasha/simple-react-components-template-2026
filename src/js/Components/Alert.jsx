import React, { useState } from 'react';

export default function Alert({ variant = 'info', title, children, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={`alert alert-${variant}`}>
      <div className="flex-1">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-body">{children}</div>
      </div>
      <button
        onClick={() => {
          setDismissed(true);
          onDismiss && onDismiss();
        }}
        className="alert-dismiss"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
