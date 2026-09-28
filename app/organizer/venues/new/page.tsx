"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewVenuePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    venue_type: "theatre",
    address_line1: "",
    address_line2: "",
    city: "",
    county: "",
    postcode: "",
    country: "United Kingdom",
    latitude: "",
    longitude: "",
    capacity: "",
    standing_capacity: "",
    seated_capacity: "",
    hero_image: "",
    status: "published",
    revenue_share_percent: "15",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const save = async () => {
    if (!form.name) { setError("Venue name is required"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/venues/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      router.push("/venue/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/venue/dashboard" className="text-sm text-gray-500 hover:text-black">
          ← Back to Venues
        </Link>
      </div>

      <h1 className="text-5xl font-bold mb-10" style={{ fontFamily: "var(--font-antonio)" }}>
        ADD VENUE
      </h1>

      <div className="space-y-8">
        <section>
          <label className="block text-sm font-medium mb-2">Venue Name *</label>
          <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Swansea Arena" />
        </section>

        <section>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="A modern arena on the waterfront" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Venue Type</label>
            <select value={form.venue_type} onChange={(e) => update("venue_type", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none">
              <option value="theatre">Theatre</option>
              <option value="club">Club</option>
              <option value="conference">Conference</option>
              <option value="arena">Arena</option>
              <option value="outdoor">Outdoor</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select value={form.status} onChange={(e) => update("status", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Revenue Share %</label>
            <input type="number" value={form.revenue_share_percent} onChange={(e) => update("revenue_share_percent", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" />
            <p className="text-xs text-gray-500 mt-1">Venue earns this % of every ticket sold</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Capacity</label>
            <input type="number" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="2000" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-antonio)" }}>LOCATION</h2>
          <div className="space-y-4">
            <input type="text" value={form.address_line1} onChange={(e) => update("address_line1", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Address line 1" />
            <input type="text" value={form.address_line2} onChange={(e) => update("address_line2", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Address line 2 (optional)" />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="City" />
              <input type="text" value={form.county} onChange={(e) => update("county", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="County" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={form.postcode} onChange={(e) => update("postcode", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Postcode" />
              <input type="text" value={form.country} onChange={(e) => update("country", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Latitude (optional)" />
              <input type="text" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="Longitude (optional)" />
            </div>
          </div>
        </section>

        <section>
          <label className="block text-sm font-medium mb-2">Hero Image URL</label>
          <input type="url" value={form.hero_image} onChange={(e) => update("hero_image", e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none" placeholder="https://images.unsplash.com/..." />
        </section>

        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

        <button onClick={save} disabled={saving} className="w-full py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50">
          {saving ? "Saving..." : "Save Venue"}
        </button>
      </div>
    </div>
  );
}
