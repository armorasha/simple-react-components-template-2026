import React from 'react';

export function Heading1({ children }) {
  return <h1 className="heading-1">{children}</h1>;
}

export function Heading2({ children }) {
  return <h2 className="heading-2">{children}</h2>;
}

export function Heading3({ children }) {
  return <h3 className="heading-3">{children}</h3>;
}

export function Body({ children }) {
  return <p className="body-text">{children}</p>;
}

export function Muted({ children }) {
  return <p className="muted-text">{children}</p>;
}
