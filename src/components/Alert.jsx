import React, { useState } from 'react';

const VARIANT_CLASSES = {
  info: 'bg-pptx-blue/15 border-pptx-blue/50',
  warning: 'bg-pptx-amber/15 border-pptx-amber/50',
  critical: 'bg-pptx-red/15 border-pptx-red/50',
  success: 'bg-pptx-green/15 border-pptx-green-light/50',
};

export default function Alert({ variant = 'info', title, children, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${VARIANT_CLASSES[variant]}`}>
      <div className="flex-1">
        {title && <div className="text-pptx-cream font-normal mb-0.5">{title}</div>}
        <div className="text-sm text-pptx-tan">{children}</div>
      </div>
      <button
        onClick={() => {
          setDismissed(true);
          onDismiss && onDismiss();
        }}
        className="text-pptx-tan hover:text-pptx-cream transition-colors leading-none text-lg"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
