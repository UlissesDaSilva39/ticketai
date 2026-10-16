import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ALLOWED = [
  "name", "handle", "genre", "city", "country",
  "bio", "website", "instagram", "spotify",
  "avatar_url", "cover_image",
] as const;

async function handle(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: artist, error: fetchErr } = await supabase
    .from("artists")
    .select("id, owner_id")
    .eq("slug", slug)
    .maybeSingle();

  if (fetchErr || !artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }
  if (artist.owner_id !== user.id) {
    return NextResponse.json({ error: "Not your profile" }, { status: 403 });
  }

  let payload: Record<string, unknown> = {};
  try { payload = await req.json(); } catch { /* ignore */ }

  const update: Record<string, unknown> = {};
  for (const key of ALLOWED) {
    if (key in payload) update[key] = payload[key];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const { error: updateErr } = await supabase
    .from("artists")
    .update(update)
    .eq("id", artist.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  return handle(req, ctx);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  return handle(req, ctx);
}