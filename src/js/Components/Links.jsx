import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const CHEVRON_ROTATION = {
  left: 'rotate-90',
  right: '-rotate-90',
};

function Chevron({ direction }) {
  return (
    <svg
      className={`shrink-0 w-[12px] h-[8px] text-current transition-transform ${CHEVRON_ROTATION[direction]}`}
      viewBox="0 0 12 8"
      fill="none"
    >
      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Links({ to, children, className = '', chevron, ...props }) {
  return (
    <RouterLink to={to} className={`link${className ? ` ${className}` : ''}`} {...props}>
      {chevron === 'left' && <Chevron direction="left" />}
      {children}
      {chevron === 'right' && <Chevron direction="right" />}
    </RouterLink>
  );
}
