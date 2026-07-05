import React, { useEffect, useState } from 'react';

const COLOR_CLASSES = {
  cream: 'text-pptx-cream',
  gold: 'text-pptx-gold',
  blue: 'text-pptx-blue',
  tan: 'text-pptx-tan',
};

export default function Clock({ color = 'cream' }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="text-right leading-tight">
      <div className={`text-lg font-light tabular-nums ${COLOR_CLASSES[color] || COLOR_CLASSES.cream}`}>{time}</div>
      <div className="text-xs uppercase tracking-wide text-pptx-tan">{date}</div>
    </div>
  );
}
