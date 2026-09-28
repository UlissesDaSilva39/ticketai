"use client";

import { useState } from "react";

export default function ResaleCheckoutButton({ token, price }: { token: string; price: number }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const claim = async () => {
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/resale/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setProcessing(false);
    }
  };

  return (
    <div>
      <button
        onClick={claim}
        disabled={processing}
        className="w-full py-4 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-800 disabled:opacity-50"
      >
        {processing ? "Redirecting to Stripe..." : "Claim for £" + price.toFixed(2)}
      </button>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      <p className="text-xs text-gray-500 mt-3 text-center">
        You will be asked to sign in first if you are not already.
      </p>
    </div>
  );
}
