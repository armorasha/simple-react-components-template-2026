import React from 'react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="breadcrumb-sep">/</span>}
          {i === items.length - 1 ? (
            <span className="breadcrumb-current">{item}</span>
          ) : (
            <a href="#" className="breadcrumb-link">
              {item}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
