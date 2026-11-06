import { NetworkCardType } from "@/lib/data";

function initials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function NetworkCard({ card }: { card: NetworkCardType }) {
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <div style={{ 
          width: "48px", 
          height: "48px", 
          borderRadius: "50%", 
          background: "rgba(22, 163, 106, 0.15)", 
          color: "#16A36A", 
          display: "grid", 
          placeItems: "center", 
          fontSize: "18px", 
          fontWeight: 700,
          flexShrink: 0
        }}>
          {initials(card.name)}
        </div>
        <div>
          <div className="card-title">{card.name}</div>
          <div className="card-subtitle">{card.handle}</div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#F8FAFC", background: "#293548", padding: "2px 6px", borderRadius: "4px" }}>
          {card.role}
        </span>
        <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", background: "#1D2940", padding: "2px 6px", borderRadius: "4px" }}>
          {card.city}
        </span>
      </div>

      <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>
        {card.bio}
      </p>

      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
        <button className="btn-secondary" style={{ flex: 1, padding: "8px", fontSize: "12px" }}>View profile</button>
        <button className="btn-primary" style={{ flex: 1, padding: "8px", fontSize: "12px" }}>Message</button>
      </div>
    </div>
  );
}
