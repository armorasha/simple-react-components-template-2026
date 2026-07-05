import React from 'react';

const STATUS_TEXT_CLASSES = {
  info: 'text-pptx-blue-light',
  success: 'text-pptx-green-light',
  warning: 'text-pptx-amber',
  critical: 'text-pptx-red-light',
  neutral: 'text-pptx-cream',
};

const DELTA_CLASSES = {
  up: 'text-pptx-green-light',
  down: 'text-pptx-red-light',
  flat: 'text-pptx-tan',
};

const DELTA_ARROW = {
  up: '▲',
  down: '▼',
  flat: '—',
};

export default function MetricTile({ label, value, unit = '', status = 'neutral', delta, deltaDirection = 'flat' }) {
  return (
    <div className="bg-pptx-charcoal-dark/60 border border-pptx-tan/10 rounded-2xl px-5 py-4 min-w-[140px]">
      <div className="text-xs uppercase tracking-wide text-pptx-tan mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-light ${STATUS_TEXT_CLASSES[status]}`}>{value}</span>
        {unit && <span className="text-sm text-pptx-tan">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className={`text-xs mt-1 ${DELTA_CLASSES[deltaDirection]}`}>
          {DELTA_ARROW[deltaDirection]} {delta}
        </div>
      )}
    </div>
  );
}
