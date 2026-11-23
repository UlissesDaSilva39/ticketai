import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// POST /api/stories/:id -> mark as seen by the logged-in user.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { error } = await supabase.from("story_views").insert({ story_id: id, viewer_id: user.id });
  // 23505 = already viewed: fine.
  if (error && error.code !== "23505") return NextResponse.json({ error: "Could not record view" }, { status: 400 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/stories/:id -> delete your own story (and its file).
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: story } = await supabase.from("stories").select("id, author_id, media_url").eq("id", id).maybeSingle();
  if (!story || story.author_id !== user.id) return NextResponse.json({ error: "Story not found" }, { status: 404 });

  const { error } = await supabase.from("stories").delete().eq("id", id).eq("author_id", user.id);
  if (error) return NextResponse.json({ error: "Could not delete story" }, { status: 500 });

  // Remove the uploaded file too (only inside the user's own folder).
  const marker = "/storage/v1/object/public/post-media/";
  const path = story.media_url.split(marker)[1];
  if (path && path.startsWith(`${user.id}/`)) {
    await createAdminClient().storage.from("post-media").remove([decodeURIComponent(path)]).catch(() => undefined);
  }
  return NextResponse.json({ ok: true });
}
