import React from 'react';
import Clock from '../Components/Clock';

export default function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen bg-pptx-charcoal bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,80,140,0.15),transparent)]">
      <div className="fixed top-4 right-6 z-30">
        <Clock />
      </div>
      <div className="px-8 py-10 space-y-10 max-w-5xl mx-auto">{children}</div>
    </div>
  );
}
