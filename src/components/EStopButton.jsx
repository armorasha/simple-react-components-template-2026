import React, { useState } from 'react';

export default function EStopButton() {
  const [engaged, setEngaged] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => setEngaged((v) => !v)}
        aria-pressed={engaged}
        className={`h-24 w-24 rounded-full border-4 font-semibold text-xs uppercase tracking-wide transition-all ${
          engaged
            ? 'bg-pptx-red-dark border-pptx-red-dark/60 text-pptx-cream-dark shadow-[inset_0_4px_10px_rgba(0,0,0,0.7)]'
            : 'bg-pptx-red border-pptx-red-light/60 text-pptx-cream shadow-[0_0_20px_rgba(147,21,21,0.6)] hover:shadow-[0_0_28px_rgba(147,21,21,0.8)] active:shadow-[inset_0_4px_10px_rgba(0,0,0,0.7)]'
        }`}
      >
        {engaged ? 'Reset' : 'E-Stop'}
      </button>
      <span className="text-xs uppercase tracking-wide text-pptx-tan">
        {engaged ? 'Engaged' : 'Ready'}
      </span>
    </div>
  );
}
