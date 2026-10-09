import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { body, event_id, image_url, audio_url, artist_slug } = await req.json();

  if ((!body || !body.trim()) && !event_id && !image_url && !audio_url) {
    return NextResponse.json(
      { error: "Post needs text, an image, audio, or an event" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const authorType =
    profile?.role === "promoter" ? "promoter"
    : profile?.role === "venue" ? "venue"
    : profile?.role === "admin" ? "promoter"
    : "user";

  let insertArtistSlug: string | null = null;
  let insertAuthorType = authorType;
  if (artist_slug && typeof artist_slug === "string") {
    const { data: owned } = await supabase
      .from("artists")
      .select("slug")
      .eq("slug", artist_slug)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (owned) {
      insertArtistSlug = artist_slug;
      insertAuthorType = "artist";
    }
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      author_type: insertAuthorType,
      artist_slug: insertArtistSlug,
      body: body ?? null,
      event_id: event_id ?? null,
      image_url: image_url ?? null,
      audio_url: audio_url ?? null,
    })
    .select("id, author_id, author_type, artist_slug, body, event_id, image_url, audio_url, like_count, comment_count, share_count, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ post: data });
}