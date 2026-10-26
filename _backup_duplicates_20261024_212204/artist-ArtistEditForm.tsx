"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AvatarUploader from "./AvatarUploader";

type Artist = {
  id: string;
  slug: string;
  name: string;
  handle: string;
  genre: string;
  city: string;
  country: string;
  bio: string;
  website: string | null;
  instagram: string | null;
  spotify: string | null;
  avatar_url: string | null;
  cover_image: string | null;
};

export default function ArtistEditForm({ artist }: { artist: Artist }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: artist.name,
    handle: artist.handle,
    genre: artist.genre,
    city: artist.city,
    country: artist.country,
    bio: artist.bio,
    website: artist.website ?? "",
    instagram: artist.instagram ?? "",
    spotify: artist.spotify ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);

    try {
      const payload = {
        ...form,
        website: form.website || null,
        instagram: form.instagram || null,
        spotify: form.spotify || null,
      };

      const res = await fetch("/api/artist/" + artist.slug + "/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        window.location.href = "/login?next=/artist/" + artist.slug + "/edit";
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:outline-none";
  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5";

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Photos</h2>
        <div className="space-y-6">
          <AvatarUploader
            artistSlug={artist.slug}
            initialUrl={artist.avatar_url}
            label="Avatar"
            fallbackInitials={artist.name.slice(0, 2).toUpperCase()}
          />
          <AvatarUploader
            artistSlug={artist.slug}
            initialUrl={artist.cover_image}
            label="Cover"
            fallbackInitials={artist.name.slice(0, 2).toUpperCase()}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Profile</h2>

        <div>
          <label className={labelClass}>Name</label>
          <input className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>

        <div>
          <label className={labelClass}>Handle</label>
          <input className={inputClass} value={form.handle} onChange={(e) => set("handle", e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Genre</label>
            <input className={inputClass} value={form.genre} onChange={(e) => set("genre", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Bio</label>
          <textarea className={inputClass + " min-h-[120px] resize-y"} value={form.bio} onChange={(e) => set("bio", e.target.value)} maxLength={800} required />
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Links</h2>
        <div>
          <label className={labelClass}>Website</label>
          <input className={inputClass} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
        </div>
        <div>
          <label className={labelClass}>Instagram</label>
          <input className={inputClass} value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@handle" />
        </div>
        <div>
          <label className={labelClass}>Spotify</label>
          <input className={inputClass} value={form.spotify} onChange={(e) => set("spotify", e.target.value)} placeholder="https://open.spotify.com/artist/..." />
        </div>
      </section>

      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {saved ? <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">Saved.</p> : null}

      <div className="flex justify-end gap-3">
        <a href={"/artist/" + artist.slug} className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium hover:bg-gray-50">
          Cancel
        </a>
        <button type="submit" disabled={busy} className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60">
          {busy ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}