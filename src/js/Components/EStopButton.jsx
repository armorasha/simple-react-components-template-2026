import React, { useState } from 'react';

export default function EStopButton() {
  const [engaged, setEngaged] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => setEngaged((v) => !v)}
        aria-pressed={engaged}
        className={`estop-btn${engaged ? ' engaged' : ''}`}
      >
        {engaged ? 'Reset' : 'E-Stop'}
      </button>
      <span className="label-caption">
        {engaged ? 'Engaged' : 'Ready'}
      </span>
    </div>
  );
}
