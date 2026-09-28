"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { TicketType } from "@/lib/types";

type VenueOption = {
  id: string;
  name: string;
  city: string | null;
  revenue_share_percent: number;
};

export default function NewEventPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [eventType, setEventType] = useState("in-person");
  const [venueId, setVenueId] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: "General Admission", price: 25, quantity: 100 },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("venues")
        .select("id, name, city, revenue_share_percent")
        .eq("organizer_id", user.id)
        .order("name");
      if (data) setVenues(data as VenueOption[]);
    });
  }, []);

  const updateTicket = (index: number, field: keyof TicketType, value: string | number) => {
    const next = [...ticketTypes];
    next[index] = { ...next[index], [field]: value };
    setTicketTypes(next);
  };

  const addTicket = () => {
    setTicketTypes([...ticketTypes, { name: "", price: 0, quantity: 100 }]);
  };

  const removeTicket = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const save = async (status: "draft" | "published") => {
    if (!title || !startDate) {
      setError("Title and start date are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, startDate, eventType,
          venueId, heroImage, ticketTypes, status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      router.push("/organizer");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/organizer" className="text-sm text-gray-500 hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-5xl font-bold mb-10" style={{ fontFamily: "var(--font-antonio)" }}>
        CREATE EVENT
      </h1>

      <div className="space-y-8">
        <section>
          <label className="block text-sm font-medium mb-2">Event Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="e.g. Midnight Waves — Live" />
        </section>

        <section>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="What makes this event special?" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date & Time *</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Event Type</label>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none">
              <option value="in-person">In Person</option>
              <option value="live-stream">Live Stream</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </section>

        <section>
          <label className="block text-sm font-medium mb-2">Venue (optional)</label>
          <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none">
            <option value="">No venue (virtual or TBD)</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
                {v.city ? " — " + v.city : ""}
                {" (" + v.revenue_share_percent + "% venue share)"}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Pick a venue to credit them with their revenue share on every ticket sold.
          </p>
        </section>

        <section>
          <label className="block text-sm font-medium mb-2">Hero Image URL</label>
          <input type="url" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="https://images.unsplash.com/..." />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Ticket Types</label>
            <button type="button" onClick={addTicket} className="text-sm font-medium px-4 py-2 border border-black rounded-full hover:bg-gray-50">
              + Add Ticket Type
            </button>
          </div>
          <div className="space-y-3">
            {ticketTypes.map((t, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-start p-4 border border-gray-200 rounded-lg">
                <div className="col-span-12 md:col-span-5">
                  <input type="text" value={t.name} onChange={(e) => updateTicket(i, "name", e.target.value)} placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm" />
                </div>
                <div className="col-span-5 md:col-span-3">
                  <input type="number" value={t.price} onChange={(e) => updateTicket(i, "price", Number(e.target.value))} placeholder="Price" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm" />
                </div>
                <div className="col-span-5 md:col-span-3">
                  <input type="number" value={t.quantity} onChange={(e) => updateTicket(i, "quantity", Number(e.target.value))} placeholder="Qty" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm" />
                </div>
                <div className="col-span-2 md:col-span-1 flex justify-end">
                  {ticketTypes.length > 1 && (
                    <button type="button" onClick={() => removeTicket(i)} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-600 border border-gray-200 rounded-full">
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={() => save("draft")} disabled={saving} className="flex-1 py-4 border-2 border-black font-medium rounded-full hover:bg-gray-50 disabled:opacity-50">
            {saving ? "Saving..." : "Save as Draft"}
          </button>
          <button type="button" onClick={() => save("published")} disabled={saving} className="flex-1 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50">
            {saving ? "Saving..." : "Publish Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
