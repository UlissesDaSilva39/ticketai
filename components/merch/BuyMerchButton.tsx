"use client";
import { useState } from "react";

export default function BuyMerchButton({
  merchId,
  externalUrl,
  checkoutUrl,
  inStock,
  pricePence,
  currency,
}: {
  merchId: string;
  artistId: string;
  externalUrl: string | null;
  checkoutUrl: string | null;
  inStock: boolean;
  pricePence: number;
  currency: string;
}) {
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const external = checkoutUrl || externalUrl;

  const handleBuy = async () => {
    setError(null);
    if (!inStock) return;

    // If the artist set an external link, use that
    if (external) {
      window.open(external, "_blank", "noopener,noreferrer");
      return;
    }

    // Otherwise start a Stripe Checkout session
    setBusy(true);
    try {
      const res = await fetch("/api/merch/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchId, quantity: qty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setBusy(false);
    }
  };

  const symbol = currency === "GBP" ? "\u00A3" : currency === "USD" ? "$" : currency === "EUR" ? "\u20AC" : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Quantity</label>
        <div className="flex items-center border border-gray-200 rounded-full">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            disabled={qty <= 1}
            className="w-9 h-9 flex items-center justify-center text-lg hover:bg-gray-100 rounded-l-full disabled:opacity-40"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(Math.min(10, qty + 1))}
            disabled={qty >= 10}
            className="w-9 h-9 flex items-center justify-center text-lg hover:bg-gray-100 rounded-r-full disabled:opacity-40"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-500 ml-auto">
          Total: <span className="font-bold text-black">{symbol}{((pricePence * qty) / 100).toFixed(2)}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={handleBuy}
        disabled={busy || !inStock}
        className={
          "w-full rounded-full text-sm font-semibold px-6 py-3 transition-colors " +
          (inStock
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-200 text-gray-500 cursor-not-allowed")
        }
      >
        {busy
          ? "Redirecting to Stripe..."
          : !inStock
          ? "Sold out"
          : external
          ? "Buy from artist"
          : "Buy now with card"}
      </button>

      {error ? (
        <p className="text-xs text-red-600 text-center" role="alert">
          {error}
        </p>
      ) : null}

      <p className="text-[11px] text-gray-400 text-center">
        Secure checkout powered by Stripe
      </p>
    </div>
  );
}