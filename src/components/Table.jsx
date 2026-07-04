import React from 'react';

export default function Table({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-pptx-blue/15">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-pptx-charcoal-dark text-pptx-tan">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2.5 font-normal">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-pptx-blue/10 text-pptx-cream hover:bg-pptx-charcoal-light/60 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2.5">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
