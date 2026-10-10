"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Props = {
  availableDates?: string[]; // ISO date strings (YYYY-MM-DD)
  onRequestDate?: (date: string) => void;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function VenueAvailabilityCalendar({
  availableDates = [],
  onRequestDate,
}: Props) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));

  const firstDay = month;
  const lastDay = endOfMonth(month);
  const daysInMonth = lastDay.getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const availableSet = new Set(availableDates);
  const todayISO = toISO(new Date());

  const monthLabel = month.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold inline-flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Availability
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium px-3">{monthLabel}</span>
          <button
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
            className="p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="aspect-square" />;
          const iso = toISO(d);
          const available = availableSet.has(iso);
          const isPast = iso < todayISO;
          const isToday = iso === todayISO;

          return (
            <button
              key={i}
              disabled={!available || isPast}
              onClick={() => onRequestDate?.(iso)}
              className={
                "aspect-square rounded-lg border text-xs font-medium transition flex items-center justify-center " +
                (isPast
                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                  : available
                  ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer"
                  : "border-gray-200 bg-white text-gray-400 cursor-not-allowed") +
                (isToday ? " ring-1 ring-black" : "")
              }
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-green-300 bg-green-50" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-gray-200 bg-white" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-gray-100 bg-gray-50" />
          Past
        </span>
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500 mb-3">
          Click an available date to send a booking enquiry.
        </p>
        <a
          href="#enquire"
          className="inline-block rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
        >
          Enquire about booking
        </a>
      </div>
    </div>
  );
}
