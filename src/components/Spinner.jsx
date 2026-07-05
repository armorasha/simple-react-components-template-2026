import React from 'react';

const SIZE_CLASSES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-[3px]',
  lg: 'w-10 h-10 border-4',
};

export default function Spinner({ size = 'md' }) {
  return (
    <div
      className={`inline-block rounded-full border-pptx-amber/25 border-t-pptx-amber animate-spin ${SIZE_CLASSES[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
}
