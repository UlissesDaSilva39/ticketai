"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { listPurchases, TrackPurchase } from "@/lib/tracks";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<TrackPurchase[]>([]);
  useEffect(() => { setPurchases(listPurchases()); }, []);

  return (
    <div className="tracks-page">
      <div className="tracks-container" style={{ padding: "48px 24px" }}>
        <Link href="/tracks" className="tracks-back">← Back to marketplace</Link>
        <h1 className="tracks-title" style={{ fontSize: 28 }}>My purchases</h1>
        {purchases.length === 0 ? (
          <div className="tracks-empty" style={{ marginTop: 32 }}>
            No purchases yet. <Link href="/tracks" style={{ color: "#4f8cff" }}>Browse the marketplace</Link>
          </div>
        ) : (
          <div className="tracks-purchases">
            {purchases.map(p => (
              <div key={p.id} className="tracks-purchase">
                <div>
                  <div className="tracks-purchase-title">{p.listingTitle}</div>
                  <div className="tracks-purchase-meta">{p.producerName} · {p.license}</div>
                </div>
                <div className="tracks-purchase-price">£{p.price}</div>
                <div className="tracks-purchase-date">{new Date(p.purchasedAt).toLocaleDateString()}</div>
                <button className="btn">Download</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
