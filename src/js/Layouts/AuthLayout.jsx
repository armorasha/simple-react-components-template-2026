import React from 'react';
import Clock from '../Components/Clock';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-pptx-charcoal bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,80,140,0.15),transparent)] flex items-center justify-center px-4">
      <div className="fixed top-4 right-6 z-30">
        <Clock color="gold" />
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
