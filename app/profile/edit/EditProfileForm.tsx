"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TrackUploader from "@/components/artist/TrackUploader";

type Initial = {
  full_name: string | null;
  bio: string | null;
  city: string | null;
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  avatar_url: string | null;
  cover_image: string | null;
  genre: string | null;
  label: string | null;
  spotify: string | null;
  youtube: string | null;
  soundcloud: string | null;
  role: string | null;
};

export default function EditProfileForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState<Initial>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isArtistLike =
    initial.role === "promoter" ||
    initial.role === "venue" ||
    initial.role === "artist";

  const set = (k: keyof Initial, v: string | null) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  const upload = async (kind: "avatar" | "cover", file: File) => {
    setUploading(kind);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/upload/profile", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        set(kind === "avatar" ? "avatar_url" : "cover_image", data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setError(data.error || "Save failed");
      }
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const initials = (form.full_name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Cover */}
      {isArtistLike ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Cover banner
          </p>
          <div className="h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-black via-gray-800 to-gray-900 relative">
            {form.cover_image ? (
              <img src={form.cover_image} alt="" className="w-full h-full object-cover" />
            ) : null}
            <label className="absolute bottom-3 right-3 px-4 py-2 bg-white/90 text-black text-xs font-medium rounded-full cursor-pointer hover:bg-white">
              {uploading === "cover" ? "Uploading..." : "Change cover"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload("cover", f);
                }}
              />
            </label>
          </div>
        </div>
      ) : null}

      {/* Avatar */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Avatar
        </p>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <label className="px-4 py-2 border border-gray-300 text-sm rounded-full cursor-pointer hover:bg-gray-50">
            {uploading === "avatar" ? "Uploading..." : "Change avatar"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload("avatar", f);
              }}
            />
          </label>
        </div>
      </div>

      {/* Text fields */}
      <Field label="Display name">
        <input
          value={form.full_name || ""}
          onChange={(e) => set("full_name", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
        />
      </Field>

      <Field label="Bio">
        <textarea
          value={form.bio || ""}
          onChange={(e) => set("bio", e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black resize-none"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="City">
          <input
            value={form.city || ""}
            onChange={(e) => set("city", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
          />
        </Field>
        {isArtistLike ? (
          <Field label="Genre">
            <input
              value={form.genre || ""}
              onChange={(e) => set("genre", e.target.value)}
              placeholder="e.g. House, Techno, Jazz"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
            />
          </Field>
        ) : null}
      </div>

      {isArtistLike ? (
        <Field label="Label">
          <input
            value={form.label || ""}
            onChange={(e) => set("label", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
          />
        </Field>
      ) : null}

      <Field label="Website">
        <input
          value={form.website || ""}
          onChange={(e) => set("website", e.target.value)}
          placeholder="https://"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Instagram">
          <input
            value={form.instagram || ""}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="username (no @)"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
          />
        </Field>
        <Field label="Twitter / X">
          <input
            value={form.twitter || ""}
            onChange={(e) => set("twitter", e.target.value)}
            placeholder="username (no @)"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
          />
        </Field>
      </div>

      {isArtistLike ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Spotify">
              <input
                value={form.spotify || ""}
                onChange={(e) => set("spotify", e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
              />
            </Field>
            <Field label="YouTube">
              <input
                value={form.youtube || ""}
                onChange={(e) => set("youtube", e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
              />
            </Field>
          </div>
          <Field label="SoundCloud">
            <input
              value={form.soundcloud || ""}
              onChange={(e) => set("soundcloud", e.target.value)}
              placeholder="https://soundcloud.com/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-black"
            />
          </Field>
        </>
      ) : null}

      {isArtistLike ? <TrackUploader /> : null}

      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
        {saved ? <span className="text-sm text-green-600">Saved</span> : null}
        {error ? <span className="text-sm text-red-600">{error}</span> : null}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}