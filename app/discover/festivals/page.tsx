"use client";

import { useState, useEffect } from "react";

export default function DiscoverFestivalsPage() {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [search, setSearch] = useState("Festival");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFestivals = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/festivals?keyword=" + encodeURIComponent(query));
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setFestivals([]);
      } else {
        setFestivals(data.data || []);
      }
    } catch (e) {
      setError("Failed to load festivals");
      setFestivals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFestivals("Festival"); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-gray-900">Discover festivals</h1>
        <p className="text-sm sm:text-base text-gray-600">The biggest multi-day events across the UK.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchFestivals(search); }} className="mb-8 flex gap-2 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search festivals..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-6 py-2 text-sm bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
          Search
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : festivals.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No festivals found for "{search}".
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3">{festivals.length} festival{festivals.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {festivals.map((fest: any) => (
              <a
                key={fest.id}
                href={fest.ticketUrl || "#"}
                target={fest.ticketUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all flex flex-col"
              >
                <div className="h-32 sm:h-40 bg-gray-100 relative shrink-0">
                  <img src={fest.image} alt={fest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 text-[9px] font-bold uppercase bg-purple-600 text-white px-1.5 py-0.5 rounded">
                    Festival
                  </span>
                </div>
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-tight">{fest.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{fest.date}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{fest.venue}, {fest.city}</p>
                  {fest.priceMin != null && (
                    <p className="text-xs font-semibold text-gray-700 mt-2">From {fest.currency} {fest.priceMin}</p>
                  )}
                  <div className="mt-auto pt-2">
                    <span className="text-xs font-semibold text-black">Get Tickets →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
