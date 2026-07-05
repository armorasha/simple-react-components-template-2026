import React, { useState } from 'react';

export default function Tabs({ tabs = [] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="tabs-list">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`tab-btn${active === i ? ' active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4 text-pptx-cream">{tabs[active] && tabs[active].content}</div>
    </div>
  );
}
