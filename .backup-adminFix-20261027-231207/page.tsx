"use client";
import { useState, useEffect } from "react";

type Placement = {
  id: string;
  artist_name: string;
  placement_type: string;
  starts_at: string;
  ends_at: string;
  amount_paid_gbp: number;
  payment_status: string;
};

export default function FeaturedAdminPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [artistName, setArtistName] = useState("");
  const [days, setDays] = useState(30);
  const [amount, setAmount] = useState(0);
  const [placementType, setPlacementType] = useState("music_page");
  const [submitting, setSubmitting] = useState(false);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/featured?type=music_page");
      const data = await res.json();
      if (data.featured) setPlacements(data.featured);
    } catch (e) {
      setError("Failed to load");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPlacements(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistName.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/featured/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist_name: artistName.trim(),
          placement_type: placementType,
          days: days,
          amount_paid_gbp: amount,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); }
      else { setArtistName(""); await fetchPlacements(); }
    } catch (e) {
      setError("Failed to create placement");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Featured placements</h1>
      <p className="text-sm text-gray-600 mb-6">Mark an artist as featured. They appear at the top of /music and /discover for the chosen duration.</p>

      <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Artist name</label>
          <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)}
            placeholder="e.g. Cody Johnson"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Placement</label>
            <select value={placementType} onChange={(e) => setPlacementType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="music_page">Music page</option>
              <option value="discover_feed">Discover feed</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Days</label>
            <input type="number" value={days} onChange={(e) => setDays(parseInt(e.target.value) || 30)} min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount paid (GBP)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} min={0} step={0.01}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <button type="submit" disabled={submitting} className="w-full bg-black text-white py-2 rounded-lg font-semibold disabled:opacity-50">
          {submitting ? "Creating..." : "Create placement"}
        </button>
      </form>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      <h2 className="text-lg font-semibold mb-3">Active placements</h2>
      {loading ? <p className="text-gray-500">Loading...</p> :
       placements.length === 0 ? <p className="text-gray-500">No active placements.</p> :
       <div className="space-y-2">
         {placements.map((p) => (
           <div key={p.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
             <div>
               <p className="font-semibold">{p.artist_name}</p>
               <p className="text-xs text-gray-500">{p.placement_type} · until {new Date(p.ends_at).toLocaleDateString()}</p>
             </div>
             <p className="text-sm font-semibold">£{p.amount_paid_gbp.toFixed(2)}</p>
           </div>
         ))}
       </div>
      }
    </div>
  );
}
