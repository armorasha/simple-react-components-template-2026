import React from 'react';
import colors from '../../sass/_color_variables.module.scss';

const STATUS_COLORS = {
  info: colors.pptxBlueLight,
  success: colors.pptxGreenLight,
  warning: colors.pptxAmber,
  critical: colors.pptxRedLight,
  neutral: colors.pptxTan,
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
      {label && <span className="label-caption">{label}</span>}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lastX} cy={lastY} r="2.5" fill={color} className="glow-dot" style={{ '--glow-color': color }} />
      </svg>
    </div>
  );
}
