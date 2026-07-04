import React from 'react';

export function Heading1({ children }) {
  return <h1 className="text-4xl font-extralight text-pptx-gold">{children}</h1>;
}

export function Heading2({ children }) {
  return <h2 className="text-2xl font-extralight text-pptx-gold">{children}</h2>;
}

export function Heading3({ children }) {
  return <h3 className="text-xl font-extralight text-pptx-gold">{children}</h3>;
}

export function Body({ children }) {
  return <p className="text-base text-pptx-cream">{children}</p>;
}

export function Muted({ children }) {
  return <p className="text-sm text-pptx-tan">{children}</p>;
}
