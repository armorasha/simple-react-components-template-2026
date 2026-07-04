import React from 'react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-pptx-tan-dark">/</span>}
          {i === items.length - 1 ? (
            <span className="text-pptx-cream">{item}</span>
          ) : (
            <a href="#" className="text-pptx-tan hover:text-pptx-cream transition-colors">
              {item}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
