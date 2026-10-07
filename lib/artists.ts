import type { SupabaseClient } from "@supabase/supabase-js";

export type ArtistProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_image: string | null;
  city: string | null;
  genre: string | null;
  label: string | null;
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  spotify: string | null;
  youtube: string | null;
  soundcloud: string | null;
  is_public: boolean | null;
};

export async function fetchArtistByUsername(
  supabase: SupabaseClient,
  username: string
): Promise<ArtistProfile | null> {
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, role, bio, avatar_url, cover_image, city, genre, label, website, instagram, twitter, spotify, youtube, soundcloud, is_public"
    )
    .eq("username", username)
    .maybeSingle();
  return (data as ArtistProfile) ?? null;
}

export async function fetchArtistFollowerCount(
  supabase: SupabaseClient,
  artistUserId: string
): Promise<number> {
  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_id", artistUserId);
  return count ?? 0;
}

export async function fetchArtistEvents(
  supabase: SupabaseClient,
  artistUserId: string
) {
  const { data } = await supabase
    .from("events")
    .select("id, title, start_date, hero_image, ticket_types, venue_id")
    .eq("organizer_id", artistUserId)
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(6);
  return data ?? [];
}

export async function fetchSimilarArtists(
  supabase: SupabaseClient,
  excludeId: string
) {
  const { data } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, city, genre")
    .neq("id", excludeId)
    .in("role", ["promoter", "venue", "artist"])
    .limit(6);
  return data ?? [];
}

export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return (n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, "") + "K";
  return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
}