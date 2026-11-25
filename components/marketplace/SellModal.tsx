"use client";
import { useState } from "react";
import { uploadMedia } from "@/components/grid/media";
import { createClient } from "@/lib/supabase/client";

// "+ Sell on GRID" / "Upload New Product": creates a real marketplace listing.
// Used by /marketplace and the Seller Dashboard.

export type Kind = "beat" | "sample_pack" | "service" | "merch";
export const TYPE_LABEL: Record<Kind, string> = { beat: "Beat", sample_pack: "Sample Pack", service: "Service", merch: "Merch" };
export const FEE_RATE = 0.1;
export const gbp = (pence: number) => `£${(pence / 100).toFixed(2)}`;

/** "+ Sell on GRID": create a listing (same modal style as checkout). */
export default function SellModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [kind, setKind] = useState<Kind>("beat");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [pwyw, setPwyw] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const needsFile = kind === "beat" || kind === "sample_pack";

  const input = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500";
  const label = "text-xs font-bold text-gray-500 uppercase mb-2 block";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const pricePence = Math.round(Number(price) * 100);
    if (title.trim().length < 3) return setError("Add a title (at least 3 characters).");
    if (!Number.isFinite(pricePence) || pricePence < 100) return setError("Price must be at least £1.");
    if (needsFile && !file) return setError("Upload the file buyers will download (ZIP, MP3, WAV, FLAC or AIFF).");
    setBusy(true);
    try {
      let coverUrl: string | null = null;
      if (cover) {
        setStep("Uploading cover…");
        coverUrl = (await uploadMedia(cover)).url;
      }
      let uploaded: { path: string; name: string } | null = null;
      if (needsFile && file) {
        setStep("Uploading file…");
        const res = await fetch("/api/marketplace/file-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ contentType: file.type, size: file.size, name: file.name }),
        });
        const t = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(t.error || "Could not start the upload.");
        const { error: upErr } = await createClient().storage.from(t.bucket).uploadToSignedUrl(t.path, t.token, file, { contentType: file.type || "application/octet-stream" });
        if (upErr) throw new Error("Upload failed. Please try again.");
        uploaded = { path: t.path, name: file.name };
      }
      setStep("Publishing…");
      const res = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ kind, title, description, pricePence, payWhatYouWant: pwyw, coverUrl, file: uploaded }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not create the listing.");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
      setStep(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sell on GRID</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">&times;</button>
        </div>

        <div className="mb-4">
          <span className={label}>What are you selling?</span>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(TYPE_LABEL) as Kind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`py-2.5 rounded-lg border-2 font-bold text-sm transition-colors ${
                  kind === k ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {TYPE_LABEL[k]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="sell-title" className={label}>Title</label>
          <input id="sell-title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder={kind === "service" ? "Mixing & Mastering (1 track)" : "Dark Techno Sample Pack Vol. 1"} className={input} />
        </div>

        <div className="mb-4">
          <label htmlFor="sell-desc" className={label}>Description</label>
          <textarea id="sell-desc" value={description} maxLength={2000} rows={3} onChange={(e) => setDescription(e.target.value)} placeholder="What's included, BPM/key, licence terms, turnaround…" className={input} />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="sell-price" className={label}>Price (£)</label>
            <input id="sell-price" type="number" min="1" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="24.99" className={input} />
          </div>
          <label className="flex items-end gap-2 pb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={pwyw} onChange={(e) => setPwyw(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            Pay what you want
          </label>
        </div>
        {Number(price) >= 1 && (
          <p className="text-[10px] text-gray-500 -mt-2 mb-4">
            You earn {gbp(Math.round(Number(price) * 100))}. Buyers pay {gbp(Math.round(Number(price) * 100 * (1 + FEE_RATE)))} including the 10% GRID fee.
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="sell-cover" className={label}>Cover image (optional)</label>
          <input id="sell-cover" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCover(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-bold file:text-emerald-700" />
        </div>

        {needsFile && (
          <div className="mb-4">
            <label htmlFor="sell-file" className={label}>File buyers download</label>
            <input id="sell-file" type="file" accept=".zip,.mp3,.wav,.flac,.aif,.aiff,application/zip,audio/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-bold file:text-emerald-700" />
            <p className="text-[10px] text-gray-500 mt-1">ZIP, MP3, WAV, FLAC or AIFF, up to 50 MB. Only paying buyers can download it.</p>
          </div>
        )}

        {error && <p role="alert" className="text-xs text-red-600 mb-3">{error}</p>}
        <button type="submit" disabled={busy} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors">
          {busy ? step ?? "Publishing…" : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
