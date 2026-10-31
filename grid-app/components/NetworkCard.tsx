import { NetworkCard as Card } from "@/lib/types";
import { roleLabel } from "@/lib/data";

function initials(name: string) {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function NetworkCard({ card }: { card: Card }) {
  const accent = card.role === "A&R" || card.kind === "label";
  return (
    <article className="card">
      <div className="card-head">
        <div className="avatar">{initials(card.name)}</div>
        <div style={{ minWidth: 0 }}>
          <div className="name">{card.name}</div>
          <div className="handle">{card.handle}</div>
          <span className={"role-pill" + (accent ? " accent" : "")}>
            {roleLabel(card.role)} · {card.city}
          </span>
        </div>
      </div>
      {card.bio && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{card.bio}</div>}
      <div className="tags">{card.genres.map(g => <span key={g} className="tag">{g}</span>)}</div>
      <div className="meta"><span>📍 {card.city}</span></div>
      <div className="actions">
        <button className="btn">View profile</button>
        <button className="btn">+ Follow</button>
        <button className="btn primary">Message</button>
      </div>
    </article>
  );
}
