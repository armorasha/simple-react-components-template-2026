import React, { useState } from 'react';

export default function AlarmPanel({ alarms = [] }) {
  const [acked, setAcked] = useState({});

  return (
    <div className="flex flex-col gap-2">
      {alarms.map((alarm) => {
        const isAcked = acked[alarm.id];
        return (
          <div
            key={alarm.id}
            className={`alarm-row severity-${alarm.severity}${isAcked ? ' acked' : ''}`}
          >
            <span className={`status-dot status-dot-alarm status-dot-${alarm.severity}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-pptx-cream truncate">{alarm.message}</div>
              <div className="text-xs text-pptx-tan">{alarm.time}</div>
            </div>
            <button
              onClick={() => setAcked((prev) => ({ ...prev, [alarm.id]: true }))}
              disabled={isAcked}
              className="alarm-ack-btn"
            >
              {isAcked ? 'Acked' : 'Ack'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
