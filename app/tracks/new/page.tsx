"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveTrack, KIND_LABELS, LICENSE_LABELS, PRICING_LABELS, TrackKind, TrackLicense, TrackPricing } from "@/lib/tracks";

const COLORS = ["#4f8cff", "#00ff87", "#ffb800", "#ef4444", "#a855f7", "#00d4ff", "#ec4899"];

export default function NewTrack() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [producerName, setProducerName] = useState("");
  const [kind, setKind] = useState<TrackKind>("beat");
  const [license, setLicense] = useState<TrackLicense>("lease");
  const [pricing, setPricing] = useState<TrackPricing>("fixed");
  const [price, setPrice] = useState(45);
  const [bpm, setBpm] = useState(120);
  const [key, setKey] = useState("C minor");
  const [genresStr, setGenresStr] = useState("Electronic");
  const [splitAvailable, setSplitAvailable] = useState(true);
  const [coverColor, setCoverColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !producerName) return;
    const id = `t-${Date.now()}`;
    saveTrack({
      id, title, description,
      producerName,
      producerHandle: `@${producerName.toLowerCase().replace(/\s+/g, "")}`,
      kind, license, pricing, price,
      splitAvailable,
      bpm, key,
      genres: genresStr.split(",").map(s => s.trim()).filter(Boolean),
      coverColor,
      status: "available",
      views: 0, saves: 0,
      collaborations: [],
      createdAt: Date.now(),
    });
    router.push(`/tracks/${id}`);
  };

  return (
    <div className="tracks-page">
      <div className="tracks-container" style={{ maxWidth: 720, padding: "48px 24px" }}>
        <h1 className="tracks-title" style={{ fontSize: 28 }}>List a track</h1>
        <p className="tracks-subtitle" style={{ fontSize: 14, marginBottom: 32 }}>
          Sell a beat, full track, loop pack or stems. Offer split collaborations.
        </p>

        <form onSubmit={handleSubmit} className="tracks-form">
          <label className="tracks-field"><span>Title</span><input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Midnight Drive (Beat)" /></label>
          <label className="tracks-field"><span>Producer / artist name</span><input required value={producerName} onChange={e => setProducerName(e.target.value)} placeholder="Late Night Drive" /></label>
          <label className="tracks-field"><span>Description</span><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What's in this track?" /></label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label className="tracks-field"><span>Type</span>
              <select value={kind} onChange={e => setKind(e.target.value as TrackKind)}>
                {(Object.keys(KIND_LABELS) as TrackKind[]).map(k => <option key={k} value={k}>{KIND_LABELS[k]}</option>)}
              </select>
            </label>
            <label className="tracks-field"><span>License</span>
              <select value={license} onChange={e => setLicense(e.target.value as TrackLicense)}>
                {(Object.keys(LICENSE_LABELS) as TrackLicense[]).map(l => <option key={l} value={l}>{LICENSE_LABELS[l]}</option>)}
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label className="tracks-field"><span>Pricing</span>
              <select value={pricing} onChange={e => setPricing(e.target.value as TrackPricing)}>
                {(Object.keys(PRICING_LABELS) as TrackPricing[]).map(p => <option key={p} value={p}>{PRICING_LABELS[p]}</option>)}
              </select>
            </label>
            <label className="tracks-field"><span>Price (£)</span>
              <input type="number" min={0} value={price} onChange={e => setPrice(Number(e.target.value))} disabled={pricing !== "fixed"} />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label className="tracks-field"><span>BPM</span><input type="number" value={bpm} onChange={e => setBpm(Number(e.target.value))} /></label>
            <label className="tracks-field"><span>Key</span><input value={key} onChange={e => setKey(e.target.value)} /></label>
          </div>

          <label className="tracks-field"><span>Genres (comma-separated)</span><input value={genresStr} onChange={e => setGenresStr(e.target.value)} /></label>

          <label className="tracks-field"><span>Cover color</span>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setCoverColor(c)} style={{
                  width: 32, height: 32, borderRadius: 6, background: c, border: coverColor === c ? "2px solid #fff" : "1px solid #2a2f38", cursor: "pointer",
                }} />
              ))}
            </div>
          </label>

          <label className="tracks-checkbox">
            <input type="checkbox" checked={splitAvailable} onChange={e => setSplitAvailable(e.target.checked)} />
            <span>Open to split collaborations</span>
          </label>

          <button type="submit" className="btn btn-primary">Publish listing</button>
        </form>
      </div>
    </div>
  );
}
