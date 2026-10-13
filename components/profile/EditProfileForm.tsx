"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/profile/actions";

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
};

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
      router.refresh();
      setTimeout(() => setOk(false), 2000);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
      <div>
        <label htmlFor="avatar_url" className="block text-sm font-medium mb-1">Avatar URL</label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          defaultValue={profile.avatar_url || ""}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
        />
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover mt-2" />
        ) : null}
      </div>

      <div>
        <label htmlFor="cover_image" className="block text-sm font-medium mb-1">Cover image URL</label>
        <input
          id="cover_image"
          name="cover_image"
          type="url"
          defaultValue={profile.cover_image || ""}
          onChange={(e) => setCover(e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
        />
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="w-full h-24 object-cover rounded-xl mt-2" />
        ) : null}
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
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={500}
          defaultValue={profile.bio || ""}
          placeholder="Tell people about yourself"
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none resize-none"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
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
            <label htmlFor={l.name} className="block text-xs text-gray-500 mb-1">{l.label}</label>
            <input
              id={l.name}
              name={l.name}
              type="text"
              defaultValue={l.value || ""}
              placeholder={l.label === "Instagram" || l.label === "Twitter / X" ? "@handle" : "https://..."}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none"
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
