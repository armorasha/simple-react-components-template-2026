import React from 'react';

export default function Toggle({ label, checked, onChange, disabled = false }) {
  return (
    <label className="toggle-label">
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`toggle-track${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}`}
      >
        <span className={`toggle-thumb${checked ? ' checked' : ''}`} />
      </span>
      {label}
    </label>
  );
}
