import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

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

  const { data: candidates } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, role, genre, city")
    .eq("is_public", true)
    .not("username", "is", null)
    .order("created_at", { ascending: false })
    .limit(60);

  const score = (p: { role: string | null; city: string | null; genre: string | null; avatar_url: string | null }) =>
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
    }));

  return NextResponse.json({ people });
}
