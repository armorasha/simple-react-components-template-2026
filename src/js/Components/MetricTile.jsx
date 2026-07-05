import React from 'react';

const DELTA_ARROW = {
  up: '▲',
  down: '▼',
  flat: '—',
};

export default function MetricTile({ label, value, unit = '', status = 'neutral', delta, deltaDirection = 'flat' }) {
  return (
    <div className="metric-tile">
      <div className="label-caption mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`metric-tile-value status-${status}`}>{value}</span>
        {unit && <span className="text-sm text-pptx-tan">{unit}</span>}
      </div>
      {delta !== undefined && (
        <div className={`metric-tile-delta delta-${deltaDirection}`}>
          {DELTA_ARROW[deltaDirection]} {delta}
        </div>
      )}
    </div>
  );
}
