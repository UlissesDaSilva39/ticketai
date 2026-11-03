"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTrack, saveTrack, addPurchase, addCollab,
  TrackListing, KIND_LABELS, LICENSE_LABELS, PRICING_LABELS,
} from "@/lib/tracks";

export default function TrackDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [track, setTrack] = useState<TrackListing | null>(null);
  const [buying, setBuying] = useState(false);
  const [bought, setBought] = useState(false);
  const [showCollab, setShowCollab] = useState(false);
  const [collabMsg, setCollabMsg] = useState("");
  const [splitPct, setSplitPct] = useState(30);
  const [fromName, setFromName] = useState("");

  useEffect(() => {
    if (id) setTrack(getTrack(id));
  }, [id]);

  if (!track) {
    return <div className="tracks-page tracks-container" style={{ padding: 48 }}>Track not found.</div>;
  }

  const handleBuy = async () => {
    if (!confirm(`Buy "${track.title}" for £${track.price}?`)) return;
    setBuying(true);
    await new Promise(r => setTimeout(r, 600));
    addPurchase({
      id: `p-${Date.now()}`,
      listingId: track.id,
      listingTitle: track.title,
      producerName: track.producerName,
      price: track.price,
      license: track.license,
      purchasedAt: Date.now(),
    });
    saveTrack({ ...track, status: "sold" });
    setBought(true);
    setBuying(false);
  };

  const handleCollab = () => {
    if (!collabMsg || !fromName) { alert("Fill in name and message"); return; }
    const newCollab = {
      id: `c-${Date.now()}`,
      fromName,
      fromHandle: `@${fromName.toLowerCase().replace(/\s+/g, "")}`,
      message: collabMsg,
      proposedSplit: splitPct,
      status: "pending" as const,
      createdAt: Date.now(),
    };
    saveTrack({ ...track, collaborations: [...track.collaborations, newCollab] });
    addCollab(newCollab);
    setShowCollab(false);
    alert("Collaboration request sent!");
  };

  return (
    <div className="tracks-page">
      <div className="tracks-container" style={{ padding: "48px 24px" }}>
        <Link href="/tracks" className="tracks-back">← Back to marketplace</Link>

        <div className="tracks-detail">
          <div className="tracks-detail-main">
            <div className="tracks-detail-cover" style={{ background: track.coverColor }}>
              <div className="tracks-detail-cover-inner">
                <div className="tracks-detail-cover-title">{track.title}</div>
                <div className="tracks-detail-cover-artist">{track.producerName}</div>
              </div>
            </div>

            <h1 className="tracks-detail-title">{track.title}</h1>
            <p className="tracks-detail-desc">{track.description}</p>

            <div className="tracks-detail-specs">
              <div className="tracks-spec"><span>BPM</span><strong>{track.bpm}</strong></div>
              <div className="tracks-spec"><span>Key</span><strong>{track.key}</strong></div>
              <div className="tracks-spec"><span>Type</span><strong>{KIND_LABELS[track.kind]}</strong></div>
              <div className="tracks-spec"><span>License</span><strong>{LICENSE_LABELS[track.license]}</strong></div>
            </div>

            <div className="tracks-detail-genres">
              {track.genres.map(g => <span key={g} className="tracks-genre">{g}</span>)}
            </div>

            {track.collaborations.length > 0 && (
              <div className="tracks-collab-list">
                <h3 className="tracks-side-title">Collaboration requests ({track.collaborations.length})</h3>
                {track.collaborations.map(c => (
                  <div key={c.id} className="tracks-collab-item">
                    <div className="tracks-collab-head">
                      <strong>{c.fromName}</strong>
                      <span className="tracks-collab-split">{c.proposedSplit}% split</span>
                    </div>
                    <p className="tracks-collab-msg">{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="tracks-detail-side">
            <div className="tracks-side-card">
              <div className="tracks-side-price">
                {track.pricing === "split-only" ? "Split only" :
                 track.pricing === "pay-what-you-want" ? "Pay what you want" :
                 `£${track.price}`}
              </div>
              <div className="tracks-side-license">{LICENSE_LABELS[track.license]} license</div>
              <div className="tracks-side-pricing">{PRICING_LABELS[track.pricing]}</div>

              {track.status === "sold" ? (
                <div className="tracks-side-sold">Sold</div>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: 16 }}
                  onClick={handleBuy}
                  disabled={buying}
                >
                  {buying ? "Processing..." : bought ? "Purchased" : `Buy now · £${track.price}`}
                </button>
              )}

              {track.splitAvailable && (
                <button
                  className="btn"
                  style={{ width: "100%", marginTop: 8 }}
                  onClick={() => setShowCollab(true)}
                >
                  Collaborate
                </button>
              )}

              <div className="tracks-side-actions">
                <button className="btn" style={{ width: "100%", marginTop: 8 }}>Save</button>
                <Link
                  href={`/meet/new?with=${track.producerHandle.replace("@", "")}`}
                  className="btn"
                  style={{ width: "100%", marginTop: 8, display: "block", textAlign: "center" }}
                >
                  Meet the producer
                </Link>
              </div>
            </div>

            <div className="tracks-side-card" style={{ marginTop: 16 }}>
              <div className="tracks-side-artist">
                <div className="tracks-side-avatar" style={{ background: track.coverColor }}>
                  {track.producerName[0]}
                </div>
                <div>
                  <div className="tracks-side-artist-name">{track.producerName}</div>
                  <div className="tracks-side-artist-handle">{track.producerHandle}</div>
                </div>
              </div>
              <Link href={`/stream/${track.producerHandle.replace("@", "")}`} className="btn" style={{ width: "100%", marginTop: 12, display: "block", textAlign: "center" }}>
                View channel
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {showCollab && (
        <>
          <div className="tracks-modal-backdrop" onClick={() => setShowCollab(false)} />
          <div className="tracks-modal">
            <h3 className="tracks-modal-title">Collaborate on "{track.title}"</h3>
            <label className="tracks-field">
              <span>Your name</span>
              <input value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Your name" />
            </label>
            <label className="tracks-field">
              <span>Message</span>
              <textarea value={collabMsg} onChange={e => setCollabMsg(e.target.value)} rows={4} placeholder="What's your vision for this track?" />
            </label>
            <label className="tracks-field">
              <span>Proposed split ({splitPct}%)</span>
              <input type="range" min={10} max={90} value={splitPct} onChange={e => setSplitPct(Number(e.target.value))} />
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn" onClick={() => setShowCollab(false)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCollab} style={{ flex: 1 }}>Send request</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
