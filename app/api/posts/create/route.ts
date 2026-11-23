import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_BODY = 2000;

// Media must come from our own Supabase Storage (post-media bucket, or the
// legacy buckets used by older uploads), never arbitrary outside links.
function ownStorageUrl(value: unknown): string | null | false {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return false;
  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;
  const allowed = ["post-media/", "chat-attachments/", "TIketai%20Mp3%20Upload/", "TIketai Mp3 Upload/"];
  return allowed.some((b) => value.startsWith(base + b)) ? value : false;
}

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const { event_id, artist_slug } = payload as { event_id?: string; artist_slug?: string };
  const body = typeof payload.body === "string" ? payload.body.trim() : "";

  const image_url = ownStorageUrl(payload.image_url);
  const video_url = ownStorageUrl(payload.video_url);
  const audio_url = ownStorageUrl(payload.audio_url);
  if (image_url === false || video_url === false || audio_url === false) {
    return NextResponse.json({ error: "Media must be uploaded through GRID." }, { status: 400 });
  }
  if (body.length > MAX_BODY) {
    return NextResponse.json({ error: `Posts can be up to ${MAX_BODY} characters.` }, { status: 400 });
  }
  if (!body && !event_id && !image_url && !video_url && !audio_url) {
    return NextResponse.json({ error: "Post needs text, a photo, a video, audio, or an event" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // Anti-spam: 10 posts per 10 minutes per user.
  if (!rateLimit(`post-create:${user.id}`, 10, 10 * 60 * 1000).ok) {
    return NextResponse.json({ error: "You're posting too fast. Try again in a few minutes." }, { status: 429 });
  }

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
      body: body || null,
      event_id: event_id ?? null,
      image_url,
      video_url,
      audio_url,
    })
    .select("id, author_id, author_type, artist_slug, body, event_id, image_url, video_url, audio_url, audio_title, audio_artist, like_count, comment_count, share_count, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ post: data });
}
