"use client";

import type { SeatmapConfig, SeatRow } from "./SeatMap";

function rowLabel(n: number): string {
  let s = "";
  n += 1;
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function makeSeats(label: string, count: number): string[] {
  return Array.from({ length: Math.max(0, count) }, (_, i) => label + (i + 1));
}

export default function SeatMapEditor({
  value,
  onChange,
}: {
  value: SeatmapConfig;
  onChange: (config: SeatmapConfig) => void;
}) {
  const addRow = () => {
    const label = rowLabel(value.rows.length);
    const newRow: SeatRow = { label, price: 25, seats: makeSeats(label, 10) };
    onChange({ rows: [...value.rows, newRow] });
  };

  const removeRow = (index: number) => {
    onChange({ rows: value.rows.filter((_, i) => i !== index) });
  };

  const setSeatCount = (index: number, raw: string) => {
    const count = Math.min(50, parseInt(raw, 10) || 0);
    const next = value.rows.map((r, i) =>
      i === index ? { ...r, seats: makeSeats(r.label, count) } : r
    );
    onChange({ rows: next });
  };

  const setPrice = (index: number, price: number) => {
    const next = value.rows.map((r, i) => (i === index ? { ...r, price } : r));
    onChange({ rows: next });
  };

  return (
    <div className="space-y-3">
      {value.rows.map((row, i) => (
        <div key={row.label} className="flex flex-wrap items-center gap-3 p-3 border border-gray-200 rounded-lg">
          <div className="font-bold w-8 text-center">{row.label}</div>
          <div>
            <label className="text-xs text-gray-500 block">Seats</label>
            <input
              type="number" min="1" max="50"
              value={row.seats.length}
              onChange={(e) => setSeatCount(i, e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block">Price</label>
            <input
              type="number" min="0"
              value={row.price}
              onChange={(e) => setPrice(i, Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="text-xs text-gray-400 ml-auto">
            {row.seats[0]} - {row.seats[row.seats.length - 1]}
          </div>
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="px-3 py-1 text-xs text-red-600 border border-red-200 rounded-full hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium hover:border-black"
      >
        + Add Row
      </button>
    </div>
  );
}