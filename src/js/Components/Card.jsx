import React from 'react';

export default function Card({ title, children, className = '' }) {
  return (
    <div className={`panel-card${className ? ` ${className}` : ''}`}>
      {title && <h3 className="panel-title">{title}</h3>}
      {children}
    </div>
  );
}
