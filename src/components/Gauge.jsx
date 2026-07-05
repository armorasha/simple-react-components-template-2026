import React from 'react';

const STATUS_COLORS = {
  info: '#1670b0',
  success: '#20b66b',
  warning: '#ff7700',
  critical: '#c91d1d',
  neutral: '#7a8ca3',
};

const GAUGE_SIZE = 140;
const PADDING = 16;
const CANVAS_SIZE = GAUGE_SIZE + PADDING * 2;
const CENTER = CANVAS_SIZE / 2;
const STROKE = 12;
const RADIUS = (GAUGE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_FRACTION = 0.75;
const ARC_LENGTH = CIRCUMFERENCE * ARC_FRACTION;
const ROTATION = 135;

export default function Gauge({ label, value = 0, min = 0, max = 100, unit = '', status = 'info' }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const color = STATUS_COLORS[status];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={CANVAS_SIZE} height={CANVAS_SIZE} viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}>
        <g transform={`rotate(${ROTATION} ${CENTER} ${CENTER})`}>
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#1a1a1e"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${pct * ARC_LENGTH} ${CIRCUMFERENCE}`}
            style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.3s ease' }}
          />
        </g>
        <text x="50%" y="52%" textAnchor="middle" className="fill-pptx-cream" style={{ fontSize: 26, fontWeight: 300 }}>
          {value}
          {unit && <tspan className="fill-pptx-tan" style={{ fontSize: 14 }}>{unit}</tspan>}
        </text>
      </svg>
      {label && <span className="text-xs uppercase tracking-wide text-pptx-tan">{label}</span>}
    </div>
  );
}
