import React from 'react';

export default function Badge({ status = 'neutral', children }) {
  return (
    <span className={`badge badge-${status}`}>
      {children}
    </span>
  );
}
