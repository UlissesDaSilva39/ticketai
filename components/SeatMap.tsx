"use client";

import { useState } from "react";

export type SeatRow = {
  label: string;
  price: number;
  seats: string[];
};

export type SeatmapConfig = {
  rows: SeatRow[];
};

export default function SeatMap({
  config,
  reservedSeats,
  maxSelectable,
  onChange,
}: {
  config: SeatmapConfig;
  reservedSeats: string[];
  maxSelectable: number;
  onChange: (seats: Array<{ label: string; price: number; row: string }>) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (seatLabel: string, price: number, rowLabel: string) => {
    if (reservedSeats.includes(seatLabel)) return;

    let next: string[];
    if (selected.includes(seatLabel)) {
      next = selected.filter((s) => s !== seatLabel);
    } else {
      if (selected.length >= maxSelectable) return;
      next = [...selected, seatLabel];
    }
    setSelected(next);

    const mapped = next.map((label) => {
      const row = config.rows.find((r) => r.seats.includes(label));
      return { label, price: row?.price || 0, row: row?.label || "" };
    });
    onChange(mapped);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="inline-block px-8 py-2 bg-black text-white text-xs uppercase tracking-widest rounded-b-lg">
          STAGE
        </div>
      </div>

      <div className="space-y-3">
        {config.rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <div className="w-8 text-xs font-bold text-center text-gray-500">
              {row.label}
            </div>
            <div className="flex flex-wrap gap-1 flex-1">
              {row.seats.map((seat) => {
                const isReserved = reservedSeats.includes(seat);
                const isSelected = selected.includes(seat);
                return (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => toggle(seat, row.price, row.label)}
                    disabled={isReserved}
                    className={
                      "w-8 h-8 rounded text-xs font-medium transition-colors " +
                      (isReserved
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isSelected
                          ? "bg-[#00FF87] text-black border-2 border-black"
                          : "bg-white border border-gray-300 hover:border-black")
                    }
                    title={seat + " - £" + row.price}
                  >
                    {seat.replace(row.label, "")}
                  </button>
                );
              })}
            </div>
            <div className="w-16 text-xs text-right text-gray-500 font-medium">
              £{row.price}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#00FF87] border-2 border-black rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Reserved</span>
        </div>
        <div className="ml-auto font-medium">
          {selected.length} of {maxSelectable} selected
        </div>
      </div>
    </div>
  );
}
