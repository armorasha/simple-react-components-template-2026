import React, { useState } from 'react';

const SEVERITY_CLASSES = {
  critical: 'border-pptx-red bg-pptx-red/10',
  warning: 'border-pptx-amber bg-pptx-amber/10',
  info: 'border-pptx-blue bg-pptx-blue/10',
};

const SEVERITY_DOT = {
  critical: 'bg-pptx-red shadow-[0_0_8px_2px_rgba(147,21,21,0.85)]',
  warning: 'bg-pptx-amber shadow-[0_0_8px_2px_rgba(255,119,0,0.85)]',
  info: 'bg-pptx-blue shadow-[0_0_8px_2px_rgba(0,80,140,0.85)]',
};

export default function AlarmPanel({ alarms = [] }) {
  const [acked, setAcked] = useState({});

  return (
    <div className="flex flex-col gap-2">
      {alarms.map((alarm) => {
        const isAcked = acked[alarm.id];
        return (
          <div
            key={alarm.id}
            className={`flex items-center gap-3 border-l-4 rounded-r-lg px-4 py-2.5 transition-opacity ${SEVERITY_CLASSES[alarm.severity]} ${
              isAcked ? 'opacity-40' : ''
            }`}
          >
            <span className={`h-2 w-2 rounded-full shrink-0 ${SEVERITY_DOT[alarm.severity]}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-pptx-cream truncate">{alarm.message}</div>
              <div className="text-xs text-pptx-tan">{alarm.time}</div>
            </div>
            <button
              onClick={() => setAcked((prev) => ({ ...prev, [alarm.id]: true }))}
              disabled={isAcked}
              className="text-xs uppercase tracking-wide px-2.5 py-1 rounded-lg border border-pptx-tan/30 text-pptx-tan hover:text-pptx-cream hover:border-pptx-tan/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {isAcked ? 'Acked' : 'Ack'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
