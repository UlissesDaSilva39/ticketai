"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function PromoterJoinPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(Boolean(data.user));
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/promoter/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName.trim(),
          city: city.trim() || null,
          bio: bio.trim() || null,
          instagram: instagram.trim() || null,
          tiktok: tiktok.trim() || null,
          youtube: youtube.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join");
      router.push("/organizer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!signedIn) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-lg mt-20 text-center">
          <h1
            className="text-5xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Sign in first
          </h1>
          <p className="mt-4 text-gray-600">
            You need an account before you can become a promoter. It takes 30
            seconds.
          </p>
          <Link
            href="/login?next=/promoters/join"
            className="mt-8 inline-block rounded-full bg-black text-white px-8 py-4 font-medium hover:bg-gray-800"
          >
            Sign in or create account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/for-promoters"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to promoters info
        </Link>

        <div className="mt-6 mb-8">
          <h1
            className="text-5xl font-bold uppercase leading-none"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Become a promoter
          </h1>
          <p className="mt-4 text-gray-600">
            Free to use. No commission. No monthly fee. Fill this in and
            you&apos;re ready to sell.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Public profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Display name <span className="text-red-500">*</span>
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. London House Collective"
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This is what attendees see on every event you publish.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="London"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell attendees what kind of events you run."
                  rows={3}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black resize-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">
              Social handles (optional)
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              We&apos;ll show these on your promoter profile so attendees can
              follow you.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Instagram
                </label>
                <div className="flex items-center rounded-lg border overflow-hidden">
                  <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="yourhandle"
                    className="flex-1 px-3 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  TikTok
                </label>
                <div className="flex items-center rounded-lg border overflow-hidden">
                  <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="yourhandle"
                    className="flex-1 px-3 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  YouTube
                </label>
                <div className="flex items-center rounded-lg border overflow-hidden">
                  <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="yourchannel"
                    className="flex-1 px-3 py-3 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/"
              className="rounded-lg border px-5 py-3 text-center text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Creating profile..." : "Become a promoter"}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Free forever. No card required. You only pay if you use premium
            features later.
          </p>
        </form>
      </div>
    </main>
  );
}
