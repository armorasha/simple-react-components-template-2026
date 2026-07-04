import React from 'react';

export default function ProgressBar({ value = 0, label }) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-pptx-tan mb-1">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="w-full h-2 rounded-lg bg-pptx-charcoal-dark shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] overflow-hidden">
        <div
          className="h-full rounded-lg bg-pptx-blue shadow-[0_0_8px_rgba(0,80,140,0.6)] transition-all w-[var(--pptx-progress)]"
          style={{ '--pptx-progress': `${pct}%` }}
        />
      </div>
    </div>
  );
}
