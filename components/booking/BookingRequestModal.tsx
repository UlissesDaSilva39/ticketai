"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

type Artist = {
  slug: string;
  name: string;
};

type Query = {
  location?: string;
  date?: string;
  genre?: string;
  capacity?: number;
};

export default function BookingRequestModal({
  artist,
  query,
  onClose,
}: {
  artist: Artist;
  query: Query;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [venue, setVenue] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/book/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist_slug: artist.slug,
          event_date: query.date,
          venue_name: venue,
          message,
          promoter_name: name,
          promoter_email: email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send request");
      } else {
        setSent(true);
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-gray-400">Booking request</div>
            <div className="mt-1 text-lg font-bold text-gray-900">{artist.name}</div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          <div className="rounded-xl bg-green-50 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
            <div className="mt-3 text-sm font-medium text-green-900">
              Request sent
            </div>
            <p className="mt-1 text-xs text-green-700">
              {artist.name} will get back to you at the email provided.
            </p>
            <button
              onClick={onClose}
              className="mt-4 rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 space-y-1">
              {query.date && <div><strong>Date:</strong> {query.date}</div>}
              {query.genre && <div><strong>Genre:</strong> {query.genre}</div>}
              {query.capacity ? <div><strong>Capacity:</strong> {query.capacity}</div> : null}
            </div>

            <input
              type="text"
              required
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Your name *"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Your email *"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <input
              type="text"
              value={venue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVenue(e.target.value)}
              placeholder="Venue / promoter name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <textarea
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="Tell them about the event..."
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            />

            {error && (
              <div className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-full bg-black py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
