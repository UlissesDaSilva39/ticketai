"use client";

import { useState } from "react";

const TIERS = [
  { id: "7day", days: 7, price: 9.99, label: "7-Day Boost", popular: false },
  { id: "30day", days: 30, price: 24.99, label: "30-Day Boost", popular: true },
  { id: "90day", days: 90, price: 59.99, label: "90-Day Boost", popular: false },
];

export default function BoostButtons({ eventId, currentFeatured }: { eventId: string; currentFeatured: boolean }) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState("");

  const boost = async (tier: string) => {
    setProcessing(tier);
    setError("");
    try {
      const res = await fetch("/api/events/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Boost failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Boost failed");
      setProcessing(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {TIERS.map((t) => (
          <div key={t.id} className={"relative border-2 rounded-lg p-6 " + (t.popular ? "border-black" : "border-gray-200")}>
            {t.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#00FF87] text-xs font-bold rounded-full">POPULAR</span>
            )}
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{t.days} days</p>
            <p className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-antonio)" }}>£{t.price.toFixed(2)}</p>
            <button
              onClick={() => boost(t.id)}
              disabled={processing !== null}
              className={"w-full py-3 rounded-full font-medium " + (t.popular ? "bg-black text-white hover:bg-gray-800" : "border border-black hover:bg-gray-50") + " disabled:opacity-50"}
            >
              {processing === t.id ? "Redirecting..." : currentFeatured ? "Extend" : "Boost Now"}
            </button>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Secure payment via Stripe. Featured status activates immediately after payment.
      </p>
    </div>
  );
}
