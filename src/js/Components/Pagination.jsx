import React, { useState } from 'react';

export default function Pagination({ pageCount = 5 }) {
  const [page, setPage] = useState(1);

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="page-nav-btn"
      >
        ‹
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => setPage(n)}
          className={`page-num-btn${n === page ? ' active' : ''}`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        disabled={page === pageCount}
        className="page-nav-btn"
      >
        ›
      </button>
    </div>
  );
}
