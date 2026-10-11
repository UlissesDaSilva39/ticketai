"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  name: string;
  bio: string;
  genre: string;
  artistType: string;
  city: string;
  country: string;
  postcode: string;
  website: string;
  spotify: string;
  instagram: string;
  secondaryGenres: string[];
  slug: string;
  cover_image?: string;
};

const GENRES = [
  "House",
  "Techno",
  "Jazz",
  "Folk",
  "Rock",
  "Hip-Hop",
  "Pop",
  "Classical",
  "Other",
];

const ARTIST_TYPES = [
  "Solo artist",
  "Band",
  "DJ",
  "Producer",
  "Collective",
];

const SECONDARY = [
  "House",
  "Techno",
  "Jazz",
  "Folk",
  "Electronic",
  "Ambient",
  "Indie",
];

const inputBase =
  "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder-gray-400 outline-none transition focus:border-black focus:bg-white";

const labelBase = "block text-sm font-medium text-gray-900 mb-1.5";

export default function ArtistEditForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [secondary, setSecondary] = useState<string[]>(
    initial.secondaryGenres || []
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [coverPreview, setCoverPreview] = useState<string>(initial.cover_image || "");
  const [uploadingCover, setUploadingCover] = useState(false);

  const update = (key: keyof Initial, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const toggleSecondary = (g: string) =>
    setSecondary((prev) =>
      prev.includes(g) ? prev.filter((v) => v !== g) : [...prev, g]
    );

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/artists/upload-cover", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Upload failed");
      setCoverPreview(json.url);
      setForm((f) => ({ ...f, cover_image: json.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch(`/api/artists/${initial.slug}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, secondaryGenres: secondary }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Update failed");
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <div>
      <div>
        <label className={labelBase}>Cover image</label>
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover preview"
            className="w-full h-40 object-cover rounded-xl border border-gray-200 mb-2"
          />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleCoverUpload}
          disabled={uploadingCover}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 disabled:opacity-60"
        />
        {uploadingCover && (
          <p className="text-xs text-gray-500 mt-1">Uploading...</p>
        )}
      </div>
      </div>

      <div>
        <label className={labelBase}>Artist name *</label>
        <input
          className={inputBase}
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelBase}>Bio *</label>
        <textarea
          className={inputBase + " resize-y min-h-[140px]"}
          value={form.bio}
          maxLength={1000}
          onChange={(e) => update("bio", e.target.value)}
          required
        />
        <p className="text-xs text-gray-500 text-right mt-1">
          {form.bio.length} / 1000
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Genre *</label>
          <select
            className={inputBase}
            value={form.genre}
            onChange={(e) => update("genre", e.target.value)}
          >
            {GENRES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelBase}>Type *</label>
          <select
            className={inputBase}
            value={form.artistType}
            onChange={(e) => update("artistType", e.target.value)}
          >
            {ARTIST_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelBase}>Secondary genres</label>
        <div className="flex flex-wrap gap-2">
          {SECONDARY.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => toggleSecondary(g)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                secondary.includes(g)
                  ? "bg-black text-white border-black"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelBase}>City *</label>
          <input
            className={inputBase}
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
        <div>
          <label className={labelBase}>Country *</label>
          <input
            className={inputBase}
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
          />
        </div>
        <div>
          <label className={labelBase}>Postcode</label>
          <input
            className={inputBase}
            value={form.postcode}
            onChange={(e) => update("postcode", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Website</label>
          <input
            className={inputBase}
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </div>
        <div>
          <label className={labelBase}>Spotify</label>
          <input
            className={inputBase}
            value={form.spotify}
            onChange={(e) => update("spotify", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelBase}>Instagram</label>
        <input
          className={inputBase}
          value={form.instagram}
          onChange={(e) => update("instagram", e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}
      {saved && (
        <p className="text-sm text-green-900 bg-green-50 p-3 rounded-lg border border-green-200">
          Changes saved.
        </p>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
