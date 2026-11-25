"use client";

import { useState, useEffect } from "react";

export default function ProfileSettings() {
  const [shopifyDomain, setShopifyDomain] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  
  // HARDCODED FOR DEMO: In reality, get this from your Auth session (e.g., "sarah-jenkins")
  const artistId = "sarah-jenkins"; 
  const isPremium = true; // Check if their subscription is active

  useEffect(() => {
    // Load current domain from our JSON file via GET (you can add a GET route later)
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    const res = await fetch("/api/shopify/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId, shopifyDomain }),
    });

    if (res.ok) setStatus("saved");
    else setStatus("error");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Artist Settings</h1>

      <div className="bg-white dark:bg-zinc-900 border rounded-lg p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          Storefront Integration
          {!isPremium && <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">Premium Required</span>}
        </h2>
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Connect your Shopify store to sell merch directly on your GRID profile.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="your-store.myshopify.com"
            value={shopifyDomain}
            onChange={(e) => setShopifyDomain(e.target.value)}
            disabled={!isPremium}
            className="flex-1 border rounded-md px-3 py-2 text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSave}
            disabled={!isPremium || status === "saving"}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
          >
            {status === "saving" ? "Saving..." : "Connect"}
          </button>
        </div>
        
        {status === "saved" && <p className="text-xs text-emerald-600 mt-2">Store connected successfully!</p>}
        {status === "error" && <p className="text-xs text-red-600 mt-2">Failed to connect store.</p>}
      </div>
    </div>
  );
}
