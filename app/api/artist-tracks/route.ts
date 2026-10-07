import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get("artistId");
  if (!artistId) return NextResponse.json({ error: "artistId required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("artist_tracks")
    .select("id, artist_id, title, duration_seconds, audio_url, play_count, position, created_at")
    .eq("artist_id", artistId)
    .order("position", { ascending: true })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tracks: data || [] });
}

export async function POST(req: NextRequest) {
  const { title, duration_seconds, audio_url } = await req.json();
  if (!title || !audio_url) {
    return NextResponse.json({ error: "title and audio_url required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { count } = await supabase
    .from("artist_tracks")
    .select("*", { count: "exact", head: true })
    .eq("artist_id", user.id);

  const { data, error } = await supabase
    .from("artist_tracks")
    .insert({
      artist_id: user.id,
      title,
      duration_seconds: duration_seconds ?? null,
      audio_url,
      position: count ?? 0,
    })
    .select("id, title, duration_seconds, audio_url, play_count, position, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ track: data });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { error } = await supabase
    .from("artist_tracks")
    .delete()
    .eq("id", id)
    .eq("artist_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}