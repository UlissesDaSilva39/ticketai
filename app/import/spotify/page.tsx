"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseSpotifyJSON, SpotifyImportResult } from "@/lib/spotifyImport";

export default function SpotifyImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [artistName, setArtistName] = useState("");
  const [artistHandle, setArtistHandle] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<SpotifyImportResult | null>(null);

  const handleImport = async () => {
    if (!file || !artistName) { alert("Pick a file and enter your name"); return; }
    setImporting(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = parseSpotifyJSON(json, artistHandle || artistName.toLowerCase().replace(/\s+/g, ""), artistName);
      setResult(res);
    } catch (e: any) {
      alert("Could not parse file: " + e.message);
    } finally {
      setImporting(false);
    }
  };

  if (result) {
    return (
      <div className="meta-page">
        <div className="meta-container" style={{ maxWidth: 640, padding: "48px 24px" }}>
          <h1 className="meta-h1">Import complete</h1>
          <div className="import-result">
            <div className="import-result-row"><span>Tracks imported</span><strong>{result.tracksImported}</strong></div>
            <div className="import-result-row"><span>Playlists imported</span><strong>{result.playlistsImported}</strong></div>
            <div className="import-result-row"><span>Top artist</span><strong>{result.topArtist || "—"}</strong></div>
            {result.errors.length > 0 && (
              <div className="import-result-errors">
                {result.errors.map((e, i) => <div key={i}>{e}</div>)}
              </div>
            )}
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="btn btn-primary" onClick={() => router.push(`/analytics/${artistHandle || artistName.toLowerCase().replace(/\s+/g, "")}`)}>
              View analytics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meta-page">
      <div className="meta-container" style={{ maxWidth: 640, padding: "48px 24px" }}>
        <h1 className="meta-h1">Import from Spotify</h1>
        <p className="meta-sub">
          Bring your real streaming data to GRID. Download your Spotify data, then upload the JSON file.
        </p>

        <div className="import-steps">
          <div className="import-step">
            <div className="import-step-num">1</div>
            <div>
              <strong>Download your data</strong>
              <p>Visit spotify.com/account/privacy → "Download your data" → wait for email → extract the ZIP → find <code>StreamingHistory*.json</code></p>
            </div>
          </div>
          <div className="import-step">
            <div className="import-step-num">2</div>
            <div>
              <strong>Fill in your details</strong>
              <div className="import-field">
                <label>Artist name</label>
                <input value={artistName} onChange={e => setArtistName(e.target.value)} placeholder="Your artist name" />
              </div>
              <div className="import-field">
                <label>Artist handle (optional)</label>
                <input value={artistHandle} onChange={e => setArtistHandle(e.target.value)} placeholder="yourhandle" />
              </div>
            </div>
          </div>
          <div className="import-step">
            <div className="import-step-num">3</div>
            <div>
              <strong>Upload the JSON file</strong>
              <div className="import-field">
                <input type="file" accept=".json" onChange={e => setFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleImport} disabled={importing}>
          {importing ? "Importing..." : "Import"}
        </button>
      </div>
    </div>
  );
}
