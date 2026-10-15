import Link from "next/link";
import { promotedMerch } from "@/data/merch";

export function PromotedMerch() {
  return (
    <section className="card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <h3 style={{ margin:0 }}>Promoted Merch</h3>
        <span style={{ fontSize:11, color:"var(--text-mute)", textTransform:"none", letterSpacing:0 }}>Sponsored ⓘ</span>
      </div>

      {promotedMerch.map(p => (
        <div key={p.id} className="merch-row">
          <div className="thumb">IMG</div>
          <div className="info">
            <div className="name">{p.name}</div>
            <div className="meta">{p.artistName} · £{p.price.toFixed(2)}</div>
            <div className="actions">
              <Link href={`/artist/${p.artistSlug}/merch/${p.slug}`} className="buy">Buy now</Link>
              <Link href={`/artist/${p.artistSlug}/merch`} className="shop">View shop</Link>
            </div>
          </div>
        </div>
      ))}

      <Link href="/artist/dj-poxy/merch"
            style={{ display:"block", textAlign:"right", marginTop:4, fontSize:12, color:"var(--text-mute)" }}>
        See all merch →
      </Link>
    </section>
  );
}