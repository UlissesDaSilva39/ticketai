"use client";

import { useState } from "react";

type Props = {
  artistSlug: string;
  artistName: string;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function ArtistBookingSection({ artistSlug, artistName }: Props) {
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
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const canGoBack = month > startOfMonth(today);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/artists/" + artistSlug + "/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selected.toISOString(),
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
      <h2 className="text-lg font-semibold mb-1">Book this artist</h2>
      <p className="text-sm text-gray-500 mb-4">
        Pick a date to send a booking request to {artistName}.
      </p>

      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          disabled={!canGoBack}
          onClick={() => setMonth(addMonths(month, -1))}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          ◀
        </button>
        <div className="text-sm font-medium">
          {month.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
        </div>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-sm hover:bg-gray-50"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-xs font-medium text-gray-500 text-center py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="aspect-square" />;
          const isPast = d < today;
          const isSelected = selected && d.toDateString() === selected.toDateString();
          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => setSelected(d)}
              className={
                "aspect-square rounded-lg text-sm font-medium transition " +
                (isPast
                  ? "text-gray-300 cursor-not-allowed"
                  : isSelected
                  ? "bg-black text-white"
                  : "text-gray-900 hover:border hover:border-black")
              }
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      {selected && (
        <form onSubmit={submit} className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <p className="text-sm font-medium">
            Request booking for{" "}
            {selected.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </p>

          <input
            type="text"
            required
            placeholder="Your name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
          />
          <input
            type="email"
            required
            placeholder="Email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
          />
          <input
            type="text"
            required
            placeholder="Venue / Promoter *"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
          />
          <textarea
            rows={4}
            placeholder="Tell us about the event..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none resize-y"
          />

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send request"}
          </button>
        </form>
      )}

      {success && (
        <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-900">
          Request sent. {artistName} will get back to you by email.
        </div>
      )}
    </section>
  );
}
