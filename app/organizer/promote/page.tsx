"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";

const PLATFORMS = ["Instagram", "TikTok", "X", "YouTube", "Facebook"];

export default function PromotePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user.id)
        .order("start_date", { ascending: false });
      if (data) setEvents(data as Event[]);
    });
  }, []);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const generateCaption = async () => {
    const ev = events.find((e) => e.id === selectedEvent);
    if (!ev) { setError("Pick an event first"); return; }
    if (selectedPlatforms.length === 0) { setError("Pick at least one platform"); return; }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: ev.title,
          eventDate: new Date(ev.start_date).toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long",
          }),
          eventCity: ev.event_type,
          eventDescription: ev.description || "",
          platforms: selectedPlatforms,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");
      setCaption(data.caption);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI failed");
    } finally {
      setGenerating(false);
    }
  };

  const savePromotion = async (status: "draft" | "scheduled") => {
    if (!selectedEvent) { setError("Pick an event first"); return; }
    if (!caption) { setError("Add a caption"); return; }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { error: insertError } = await supabase.from("promotions").insert({
        organizer_id: user.id,
        event_id: selectedEvent,
        platforms: selectedPlatforms,
        caption,
        status,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      });
      if (insertError) throw insertError;
      setSuccess(status === "scheduled" ? "Promotion scheduled!" : "Promotion saved as draft.");
      setCaption("");
      setSelectedPlatforms([]);
      setScheduledAt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/organizer" className="text-sm text-gray-500 hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>
      <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-antonio)" }}>PROMOTE</h1>
      <p className="text-gray-500 mb-10">Create social media posts with AI-generated captions.</p>
      <div className="space-y-8">
        <section>
          <label className="block text-sm font-medium mb-2">1. Pick an Event</label>
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none">
            <option value="">Select an event...</option>
            {events.map((e) => (<option key={e.id} value={e.id}>{e.title}</option>))}
          </select>
        </section>
        <section>
          <label className="block text-sm font-medium mb-2">2. Choose Platforms</label>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map((p) => (
              <button key={p} type="button" onClick={() => togglePlatform(p)} className={"px-5 py-2 rounded-full border-2 text-sm font-medium " + (selectedPlatforms.includes(p) ? "border-black bg-black text-white" : "border-gray-300 hover:border-black")}>
                {p}
              </button>
            ))}
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">3. Caption</label>
            <button type="button" onClick={generateCaption} disabled={generating} className="px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50">
              {generating ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={10} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none font-mono text-sm" placeholder="Write a caption, or click Generate with AI..." />
        </section>
        <section>
          <label className="block text-sm font-medium mb-2">4. Schedule (optional)</label>
          <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" />
        </section>
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{success}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => savePromotion("draft")} disabled={saving} className="flex-1 py-4 border-2 border-black font-medium rounded-full hover:bg-gray-50 disabled:opacity-50">
            {saving ? "Saving..." : "Save as Draft"}
          </button>
          <button type="button" onClick={() => savePromotion("scheduled")} disabled={saving} className="flex-1 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50">
            {saving ? "Saving..." : "Schedule Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
