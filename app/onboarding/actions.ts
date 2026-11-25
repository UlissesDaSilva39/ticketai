"use server";

import { createServerSupabase } from "@/lib/supabase/server";

// Saves the onboarding answers to the member's profile.
const ROLE_MAP = { artist: "artist", venue: "venue", curator: "a_and_r" } as const;
type Choice = keyof typeof ROLE_MAP;

const httpUrl = (v: string) => {
  const s = v.trim();
  if (!s) return null;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString().slice(0, 200) : null;
  } catch {
    return null;
  }
};

export async function saveOnboarding(input: { choice: string; genre: string; city: string; spotify: string; other: string }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please log in again." };

  if (!(input.choice in ROLE_MAP)) return { error: "Please choose who you are." };
  const genre = input.genre.trim().slice(0, 60) || null;
  const city = input.city.trim().slice(0, 80) || null;
  const spotify = httpUrl(input.spotify);
  const other = httpUrl(input.other);
  if (input.spotify.trim() && !spotify) return { error: "That Spotify link doesn't look right." };
  if (input.other.trim() && !other) return { error: "That link doesn't look right." };

  const { data: current } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();

  const patch: Record<string, string | null> = { genre, city };
  // Never downgrade staff accounts.
  if (current?.role !== "admin") patch.role = ROLE_MAP[input.choice as Choice];
  if (spotify) patch.spotify = spotify;
  if (other) {
    if (/soundcloud\.com/i.test(other)) patch.soundcloud = other;
    else if (/youtube\.com|youtu\.be/i.test(other)) patch.youtube = other;
    else patch.website = other;
  }

  const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
  if (error) return { error: "Could not save your profile. Please try again." };
  return { ok: true, role: patch.role ?? current?.role ?? null };
}
