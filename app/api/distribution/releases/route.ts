import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// GET /api/distribution/releases: my releases, newest first.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data, error } = await supabase
    .from("releases")
    .select("id, title, primary_artist, release_type, release_date, status, updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ releases: [], setupPending: true });

  const ids = (data ?? []).map((r) => r.id);
  const { data: tracks } = ids.length
    ? await supabase.from("release_tracks").select("release_id").in("release_id", ids)
    : { data: [] as { release_id: string }[] };
  const counts = new Map<string, number>();
  for (const t of tracks ?? []) counts.set(t.release_id, (counts.get(t.release_id) ?? 0) + 1);

  return NextResponse.json({
    releases: (data ?? []).map((r) => ({
      id: r.id,
      title: r.title,
      primaryArtist: r.primary_artist,
      releaseType: r.release_type,
      releaseDate: r.release_date,
      status: r.status,
      updatedAt: r.updated_at,
      trackCount: counts.get(r.id) ?? 0,
    })),
  });
}

// POST /api/distribution/releases: start a new draft release.
export async function POST() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to start a release." }, { status: 401 });
  if (!rateLimit(`release-new:${user.id}`, 20, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "You've started a lot of releases. Try again later." }, { status: 429 });
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
  const artist = (profile?.full_name && !profile.full_name.includes("@") ? profile.full_name : profile?.username) ?? "";

  const { data, error } = await createAdminClient()
    .from("releases")
    .insert({ owner_id: user.id, primary_artist: artist.slice(0, 200), copyright_line: artist ? `${new Date().getFullYear()} ${artist}`.slice(0, 200) : null })
    .select("id")
    .single();
  if (error || !data) {
    console.error("[distribution/releases POST]", error?.message);
    return NextResponse.json({ error: "Distribution is being set up. Please try again soon." }, { status: 500 });
  }
  return NextResponse.json({ id: data.id });
}
