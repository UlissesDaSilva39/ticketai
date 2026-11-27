import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { promotedIds } from "@/lib/promote/server";

export const dynamic = "force-dynamic";

// "Artists to follow": public profiles the user doesn't follow yet.
// Prefers artists, then people in the same city or genre, then complete profiles.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ people: [] });

  const [{ data: me }, { data: follows }] = await Promise.all([
    supabase.from("profiles").select("city, genre").eq("id", user.id).maybeSingle(),
    supabase.from("follows").select("target_id").eq("follower_id", user.id).eq("target_type", "user"),
  ]);
  const skip = new Set<string>([user.id, ...(follows ?? []).map((f) => f.target_id as string)]);

  const cols = "id, full_name, username, avatar_url, role, genre, city";
  // Paid profile promotions ("GRID Boost") are suggested first, with a Promoted label.
  const boostedIds = (await promotedIds("profile")).filter((id) => !skip.has(id));
  const [{ data: newest }, { data: boostedProfiles }] = await Promise.all([
    supabase.from("profiles").select(cols).eq("is_public", true).not("username", "is", null).order("created_at", { ascending: false }).limit(60),
    boostedIds.length
      ? createAdminClient().from("profiles").select(cols).in("id", boostedIds).eq("is_public", true).not("username", "is", null)
      : Promise.resolve({ data: [] as never[] }),
  ]);
  const boosted = new Set((boostedProfiles ?? []).map((p) => p.id));
  const candidates = [...(boostedProfiles ?? []), ...(newest ?? []).filter((p) => !boosted.has(p.id))];

  // Premium perk: Premium members are suggested first.
  const candidateIds = (candidates ?? []).map((p) => p.id);
  const { data: premiumSubs } = candidateIds.length
    ? await createAdminClient().from("subscriptions").select("user_id").in("user_id", candidateIds).eq("plan", "premium").in("status", ["trialing", "active", "past_due"])
    : { data: [] as { user_id: string }[] };
  const premium = new Set((premiumSubs ?? []).map((s) => s.user_id));

  const score = (p: { id: string; role: string | null; city: string | null; genre: string | null; avatar_url: string | null }) =>
    (boosted.has(p.id) ? 100 : 0) +
    (premium.has(p.id) ? 6 : 0) +
    (p.role === "artist" ? 4 : 0) +
    (me?.city && p.city && p.city.toLowerCase() === me.city.toLowerCase() ? 2 : 0) +
    (me?.genre && p.genre && p.genre.toLowerCase() === me.genre.toLowerCase() ? 2 : 0) +
    (p.avatar_url ? 1 : 0);

  const people = (candidates ?? [])
    .filter((p) => !skip.has(p.id))
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      name: p.full_name && !p.full_name.includes("@") ? p.full_name : p.username,
      username: p.username,
      avatar: p.avatar_url,
      role: p.role,
      genre: p.genre,
      promoted: boosted.has(p.id),
    }));

  return NextResponse.json({ people });
}
