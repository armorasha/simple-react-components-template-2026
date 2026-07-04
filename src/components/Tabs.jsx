import React, { useState } from 'react';

export default function Tabs({ tabs = [] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-1 bg-pptx-charcoal-dark rounded-xl p-1 w-fit">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-1.5 rounded-lg text-sm font-light transition-all ${
              active === i
                ? 'bg-pptx-blue text-pptx-cream-dark [text-shadow:0_1px_1px_rgba(0,0,0,0.4)] shadow-[inset_0_0_8px_rgba(0,0,0,0.8),0_0_12px_rgba(0,80,140,0.35)]'
                : 'text-pptx-tan hover:text-pptx-cream'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4 text-pptx-cream">{tabs[active] && tabs[active].content}</div>
    </div>
  );
}
