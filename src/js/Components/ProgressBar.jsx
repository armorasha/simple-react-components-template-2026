import React from 'react';

export default function ProgressBar({ value = 0, label }) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {label && (
        <div className="progress-label-row">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ '--pptx-progress': `${pct}%` }}
        />
      </div>
    </div>
  );
}
