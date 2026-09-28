"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";

export default function PromoterEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [promoting, setPromoting] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: p } = await supabase
        .from("promoters")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (p) {
        const { data: pe } = await supabase
          .from("promoter_events")
          .select("event_id")
          .eq("promoter_id", p.id);
        if (pe) setPromoting(pe.map((r) => r.event_id));
      }

      const { data: ev } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("start_date", { ascending: true });

      if (ev) setEvents(ev as Event[]);
      setLoading(false);
    });
  }, []);

  const apply = async (eventId: string) => {
    setApplying(eventId);
    setMessage("");
    try {
      const res = await fetch("/api/promoter/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPromoting([...promoting, eventId]);
      setMessage("You are now promoting this event. Check your dashboard for the referral code.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    } finally {
      setApplying(null);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/promoter/dashboard" className="text-sm text-gray-500 hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>

      <h1
        className="text-5xl font-bold mb-3"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        FIND EVENTS TO PROMOTE
      </h1>
      <p className="text-gray-500 mb-10">
        Pick events, share your unique referral link, earn commission on every ticket sold.
      </p>

      {message && (
        <p className="text-sm bg-blue-50 text-blue-700 p-3 rounded-lg mb-6">{message}</p>
      )}

      {events.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">No events available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const isPromoting = promoting.includes(event.id);
            return (
              <div
                key={event.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 border border-gray-200 rounded-lg"
              >
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.start_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  {isPromoting ? (
                    <span className="inline-block px-5 py-2 bg-[#00FF87] text-black text-sm font-medium rounded-full">
                      ✓ Promoting
                    </span>
                  ) : (
                    <button
                      onClick={() => apply(event.id)}
                      disabled={applying === event.id}
                      className="px-5 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 disabled:opacity-50"
                    >
                      {applying === event.id ? "Applying..." : "Promote This"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}