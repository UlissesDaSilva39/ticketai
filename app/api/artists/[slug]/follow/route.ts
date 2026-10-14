import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const { data: artist, error: artistErr } = await supabase
    .from("artists")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (artistErr || !artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  const { error: followErr } = await supabase
    .from("follows")
    .upsert(
      { follower_id: user.id, target_type: "artist", target_id: artist.id },
      { onConflict: "follower_id,target_type,target_id" }
    );

  if (followErr) {
    return NextResponse.json({ error: followErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const { data: artist } = await supabase
    .from("artists")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("target_type", "artist")
    .eq("target_id", artist.id);

  return NextResponse.json({ ok: true });
}
