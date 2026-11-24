"use client";

import Link from "next/link";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/profile/actions";
import { kindOf, uploadMedia, validateFile } from "@/components/grid/media";
import { refreshMe } from "@/lib/hooks/useMe";
import { OPEN_TO } from "@/lib/open-to";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  cover_image: string | null;
  bio: string | null;
  city: string | null;
  genre: string | null;
  role: string | null;
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  spotify: string | null;
  youtube: string | null;
  soundcloud: string | null;
  is_public: boolean | null;
  headline?: string | null;
  open_to?: string[] | null;
};

/** Upload button for profile/cover photos (same secure upload as posts). */
function PhotoUpload({ label, onUploaded, onError }: { label: string; onUploaded: (url: string) => void; onError: (msg: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <label className={`cursor-pointer rounded-full border border-gray-300 dark:border-gray-700 px-4 py-1.5 text-sm font-medium hover:border-gray-800 ${busy ? "opacity-60 pointer-events-none" : ""}`}>
      {busy ? "Uploading…" : label}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          const problem = await validateFile(file);
          if (problem || kindOf(file) !== "image") return onError(problem || "Please choose a photo.");
          setBusy(true);
          try {
            const up = await uploadMedia(file);
            onUploaded(up.url);
            onError("");
          } catch (err) {
            onError(err instanceof Error ? err.message : "Upload failed. Try again.");
          } finally {
            setBusy(false);
          }
        }}
      />
    </label>
  );
}

export default function EditProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const [avatar, setAvatar] = useState(profile.avatar_url || "");
  const [cover, setCover] = useState(profile.cover_image || "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setOk(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res.error) {
        setError(res.error);
        return;
      }
      setOk(true);
      refreshMe(); // update the navbar/home card with the new name and photo
      router.refresh();
      setTimeout(() => setOk(false), 2000);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
      <div>
        <span className="block text-sm font-medium mb-1">Profile photo</span>
        <div className="flex items-center gap-3">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <span className="grid w-16 h-16 place-items-center rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500">No photo</span>
          )}
          <PhotoUpload label={avatar ? "Change photo" : "Upload photo"} onUploaded={setAvatar} onError={setError} />
          {avatar && (
            <button type="button" onClick={() => setAvatar("")} className="text-xs text-gray-500 hover:text-red-600">
              Remove
            </button>
          )}
        </div>
        {/* The uploaded image's address is saved with the form. */}
        <input type="hidden" name="avatar_url" value={avatar} />
      </div>

      <div>
        <span className="block text-sm font-medium mb-1">Cover image</span>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="w-full h-24 object-cover rounded-xl mb-2" />
        ) : null}
        <div className="flex items-center gap-3">
          <PhotoUpload label={cover ? "Change cover" : "Upload cover"} onUploaded={setCover} onError={setError} />
          {cover && (
            <button type="button" onClick={() => setCover("")} className="text-xs text-gray-500 hover:text-red-600">
              Remove
            </button>
          )}
        </div>
        <input type="hidden" name="cover_image" value={cover} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium mb-1">Full name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={profile.full_name || ""}
            maxLength={80}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-black focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={profile.username || ""}
            maxLength={30}
            pattern="[A-Za-z0-9_.-]+"
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-black focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="headline" className="block text-sm font-medium mb-1">Headline</label>
        <input
          id="headline"
          name="headline"
          type="text"
          maxLength={120}
          defaultValue={profile.headline || ""}
          placeholder="e.g. House producer & DJ | Resident @ Fabric | 2M streams"
          className="w-full px-3 py-2 mb-1 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-black focus:outline-none"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Shown under your name on cards across GRID. Max 120 characters.</p>

        <fieldset className="mb-4">
          <legend className="block text-sm font-medium mb-1">Open to…</legend>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Adds a green ring and badge to your photo so the right people reach out.</p>
          <input type="hidden" name="open_to_present" value="1" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OPEN_TO.map((o) => (
              <label key={o.value} className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-900/20">
                <input type="checkbox" name="open_to" value={o.value} defaultChecked={!!profile.open_to?.includes(o.value)} className="h-4 w-4 accent-emerald-600" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={500}
          defaultValue={profile.bio || ""}
          placeholder="Tell people about yourself"
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-black focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
          <input
            id="city"
            name="city"
            type="text"
            defaultValue={profile.city || ""}
            maxLength={80}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-black focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="genre" className="block text-sm font-medium mb-1">Genre</label>
          <input
            id="genre"
            name="genre"
            type="text"
            defaultValue={profile.genre || ""}
            maxLength={60}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-black focus:outline-none"
          />
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium mb-1">Links</legend>
        {[
          { name: "website", label: "Website", value: profile.website },
          { name: "instagram", label: "Instagram", value: profile.instagram },
          { name: "twitter", label: "Twitter / X", value: profile.twitter },
          { name: "spotify", label: "Spotify", value: profile.spotify },
          { name: "youtube", label: "YouTube", value: profile.youtube },
          { name: "soundcloud", label: "SoundCloud", value: profile.soundcloud },
        ].map((l) => (
          <div key={l.name}>
            <label htmlFor={l.name} className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{l.label}</label>
            <input
              id={l.name}
              name={l.name}
              type="text"
              defaultValue={l.value || ""}
              placeholder={l.label === "Instagram" || l.label === "Twitter / X" ? "@handle" : "https://..."}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:border-black focus:outline-none"
            />
          </div>
        ))}
      </fieldset>

      <div className="flex items-center gap-3">
        <input
          id="is_public"
          name="is_public"
          type="hidden"
          value={profile.is_public ? "true" : "false"}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            defaultChecked={profile.is_public ?? true}
            onChange={(e) => {
              const input = document.getElementById("is_public") as HTMLInputElement | null;
              if (input) input.value = e.target.checked ? "true" : "false";
            }}
            className="rounded"
          />
          Make my profile public
        </label>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {ok ? <p className="text-sm text-green-600">Saved.</p> : null}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
        <Link
          href="/profile"
          className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-800 transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}


