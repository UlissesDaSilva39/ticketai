"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaignForm({ events }: { events: Array<{ id: string; title: string }> }) {
  const router = useRouter();
  const [audienceType, setAudienceType] = useState("all");
  const [eventId, setEventId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ recipients: number; successful: number; failed: number } | null>(null);

  const send = async () => {
    if (!subject.trim() || !body.trim()) {
      setError("Subject and body are required");
      return;
    }
    if (audienceType === "event" && !eventId) {
      setError("Pick an event");
      return;
    }
    if (!confirm("Send this email to your attendees? This cannot be undone.")) return;

    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audienceType, eventId, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  };

  if (result) {
    return (
      <div className="bg-[#00FF87] rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-antonio)" }}>CAMPAIGN SENT</h2>
        <p className="text-lg mb-6">
          {result.successful} of {result.recipients} emails delivered
          {result.failed > 0 ? " · " + result.failed + " failed" : ""}
        </p>
        <button onClick={() => router.push("/organizer/campaigns")} className="px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800">
          Back to Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <label className="block text-sm font-medium mb-2">Audience</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-black">
            <input type="radio" name="audience" checked={audienceType === "all"} onChange={() => setAudienceType("all")} className="w-4 h-4" />
            <span>All past attendees (across all your events)</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-black">
            <input type="radio" name="audience" checked={audienceType === "event"} onChange={() => setAudienceType("event")} className="w-4 h-4" />
            <span>Attendees of a specific event</span>
          </label>
        </div>
      </section>

      {audienceType === "event" && (
        <section>
          <label className="block text-sm font-medium mb-2">Which event?</label>
          <select value={eventId} onChange={(e) => setEventId(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none">
            <option value="">Select an event...</option>
            {events.map((e) => (<option key={e.id} value={e.id}>{e.title}</option>))}
          </select>
        </section>
      )}

      <section>
        <label className="block text-sm font-medium mb-2">Subject line</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="We are back with another House Music Night" />
      </section>

      <section>
        <label className="block text-sm font-medium mb-2">Message</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Hi there, we are excited to announce..." />
      </section>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

      <button onClick={send} disabled={sending} className="w-full py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50">
        {sending ? "Sending..." : "Send Campaign"}
      </button>
      <p className="text-xs text-gray-500 text-center">Emails sent via Resend. Free tier limit: 100 per day.</p>
    </div>
  );
}
