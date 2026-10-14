"use client";
import { useState } from "react";

export default function BuyMerchButton({
  merchId,
  artistId,
  externalUrl,
  checkoutUrl,
  inStock,
}: {
  merchId: string;
  artistId: string;
  externalUrl: string | null;
  checkoutUrl: string | null;
  inStock: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const target = checkoutUrl || externalUrl;

  const handleBuy = async () => {
    setError(null);

    if (!inStock) {
      setError("This item is sold out.");
      return;
    }

    if (target) {
      window.open(target, "_blank", "noopener,noreferrer");
      return;
    }

    // No external URL — treat as "notify artist"
    setBusy(true);
    try {
      const res = await fetch("/api/merch/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchId, artistId }),
      });
      if (!res.ok) throw new Error("Could not send enquiry");
      setError("Enquiry sent — the artist will contact you.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleBuy}
        disabled={busy || !inStock}
        className={`w-full rounded-full text-sm font-semibold px-6 py-3 transition-colors ${
          inStock
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        } disabled:opacity-60`}
      >
        {busy
          ? "Sending enquiry..."
          : inStock
          ? target
            ? "Buy now"
            : "Notify me when available"
          : "Sold out"}
      </button>
      {error ? (
        <p className="text-xs text-amber-700 mt-2 text-center" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}