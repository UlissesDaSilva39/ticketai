"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  title: string;
  price_pence: number;
  image_url: string | null;
};

export default function MerchGrid({ artistId }: { artistId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/merch?artistId=" + artistId)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .finally(() => setLoading(false));
  }, [artistId]);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold">Merch</h2>
      </div>
      <ul className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((m) => (
          <li key={m.id} className="group">
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              {m.image_url ? (
                <img
                  src={m.image_url}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-300">
                  {"£" + (m.price_pence / 100).toFixed(0)}
                </span>
              )}
            </div>
            <p className="text-sm font-medium mt-3 truncate">{m.title}</p>
            <p className="text-sm font-bold mt-0.5">
              {"£" + (m.price_pence / 100).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
      <div className="px-6 py-3 border-t border-gray-100 text-center">
        <p className="text-[10px] uppercase tracking-wider text-gray-400">
          Checkout coming soon
        </p>
      </div>
    </div>
  );
}