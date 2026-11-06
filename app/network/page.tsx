"use client";
import { useEffect, useState } from "react";
import { getCardsForTab } from "@/lib/data";
import NetworkCard from "@/components/network/NetworkCard";

export default function NetworkPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [tab, setTab] = useState("everyone");

  useEffect(() => {
    setCards(getCardsForTab(tab));
  }, [tab]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Network</h1>
          <p className="page-subtitle">Connect with the people building music.</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input 
          type="text" 
          placeholder="Search artists, DJs, producers, managers, promoters..." 
          style={{ flex: 1, padding: "12px 16px", background: "#172033", border: "1px solid #293548", borderRadius: "8px", color: "#F8FAFC", outline: "none" }}
        />
        <button className="btn-secondary" style={{ padding: "0 24px" }}>Search</button>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "8px" }}>
        {["Everyone", "Artists", "DJs", "Producers", "Bands", "Managers", "Promoters", "Venues", "A&R"].map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t.toLowerCase())}
            style={{ 
              padding: "6px 12px", 
              borderRadius: "999px", 
              background: tab === t.toLowerCase() ? "#16A36A" : "#172033", 
              color: tab === t.toLowerCase() ? "#fff" : "#94A3B8",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              whiteSpace: "nowrap"
            }}>
            {t}
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#94A3B8", marginBottom: "16px" }}>
        People you may know ({cards.length})
      </h2>

      {/* CARDS GRID */}
      <div className="grid-cards">
        {cards.map(c => (
          <NetworkCard key={c.id} card={c} />
        ))}
      </div>
    </div>
  );
}
