import React from 'react';

export default function StatusLight({ status = 'neutral', size = 'md', children }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-pptx-cream">
      <span className={`status-dot status-dot-${size} status-dot-${status}`} />
      {children}
    </span>
  );
}
