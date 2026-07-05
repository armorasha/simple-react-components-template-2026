import React from 'react';

const STATUS_COLORS = {
  info: '#1670b0',
  success: '#20b66b',
  warning: '#ff7700',
  critical: '#c91d1d',
  neutral: '#7a8ca3',
};

export default function Sparkline({ data = [], status = 'info', width = 120, height = 36, label }) {
  const color = STATUS_COLORS[status];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const lastX = width;
  const lastY = height - ((data[data.length - 1] - min) / range) * height;

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-xs uppercase tracking-wide text-pptx-tan">{label}</span>}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lastX} cy={lastY} r="2.5" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
      </svg>
    </div>
  );
}
