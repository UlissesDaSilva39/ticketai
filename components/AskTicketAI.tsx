"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type AIEvent = {
  id: string;
  title: string;
  date: string;
  venue: string | null;
  city: string | null;
  lowest_price: number | null;
  image: string | null;
};

export default function AskTicketAI() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [events, setEvents] = useState<AIEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");
    setEvents([]);
    setError("");

    try {
      const result = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = await result.json();

      if (!result.ok || !data.success) {
        throw new Error(data.error || "AI request failed");
      }
      setResponse(data.response || "No response received.");
      setEvents(data.events || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg text-black">
      <h2
        className="text-3xl font-bold uppercase mb-2"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Ask TicketAI
      </h2>
      <p className="text-gray-500 mb-4">
        Tell me what kind of event you&apos;re looking for.
      </p>

      <form onSubmit={ask}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Example: House music events in London this weekend under £30"
          rows={3}
          disabled={loading}
          className="w-full p-4 border border-gray-200 rounded-lg text-base resize-y"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="mt-3 px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "TicketAI is thinking..." : "Ask TicketAI"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {events.map((e) => (
            <Link
              key={e.id}
              href={"/event/" + e.id}
              className="flex gap-3 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-24 bg-gray-200 shrink-0">
                {e.image && (
                  <img src={e.image} alt="" aria-hidden="true" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="py-2 pr-2 min-w-0">
                <p className="font-bold truncate">{e.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(e.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                  {e.venue ? " · " + e.venue : ""}
                </p>
                <p className="text-sm font-medium">
                  {e.lowest_price === null
                    ? "Tickets available"
                    : e.lowest_price === 0
                    ? "Free"
                    : "From £" + e.lowest_price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
