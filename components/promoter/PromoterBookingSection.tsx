"use client";

import { useState } from "react";

type Props = {
  promoterId: string;
  promoterName: string;
};

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

export default function PromoterBookingSection({ promoterId, promoterName }: Props) {
  const today = startOfDay(new Date());
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);
  const [form, setForm] = useState({ name: "", email: "", venue: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const firstOfMonth = startOfMonth(month);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const canGoBack = month > startOfMonth(today);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/promoters/" + promoterId + "/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selected.toISOString().slice(0, 10),
          name: form.name,
          email: form.email,
          venue: form.venue,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Request failed");
      }
      setSuccess(true);
      setForm({ name: "", email: "", venue: "", message: "" });
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-1">Book this promoter</h2>
      <p className="text-sm text-gray-500 mb-4">
        Pick a date and send a booking enquiry to {promoterName}.
      </p>

      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => canGoBack && setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          disabled={!canGoBack}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40"
        >
          ‹
        </button>
        <div className="text-sm font-medium">
          {month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </div>
        <button
          type="button"
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const isPast = c < today;
          const isSelected = selected && c.toDateString() === selected.toDateString();
          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => setSelected(c)}
              className={
                "aspect-square rounded-lg text-sm transition " +
                (isSelected
                  ? "bg-black text-white"
                  : isPast
                  ? "text-gray-300"
                  : "hover:bg-gray-100")
              }
            >
              {c.getDate()}
            </button>
          );
        })}
      </div>

      {selected && (
        <form onSubmit={submit} className="space-y-3 border-t pt-4">
          <p className="text-xs text-gray-500">
            Selected: {selected.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <input
            type="text" required placeholder="Your name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
          />
          <input
            type="email" required placeholder="Your email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
          />
          <input
            type="text" placeholder="Venue (optional)"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
          />
          <textarea
            rows={4} placeholder="Message (optional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none resize-y"
          />

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          {success && (
            <p className="text-sm text-green-900 bg-green-50 border border-green-200 p-3 rounded-lg">
              Booking request sent.
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send booking request"}
          </button>
        </form>
      )}
    </section>
  );
}