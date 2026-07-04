import React, { useState } from 'react';

export default function Pagination({ pageCount = 5 }) {
  const [page, setPage] = useState(1);

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="px-2.5 py-1 rounded-lg text-sm text-pptx-tan hover:text-pptx-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => setPage(n)}
          className={`w-8 h-8 rounded-lg text-sm transition-all ${
            n === page
              ? 'bg-pptx-blue text-pptx-cream-dark shadow-[inset_0_0_6px_rgba(0,0,0,0.7)]'
              : 'text-pptx-tan hover:text-pptx-cream'
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        disabled={page === pageCount}
        className="px-2.5 py-1 rounded-lg text-sm text-pptx-tan hover:text-pptx-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>
    </div>
  );
}
