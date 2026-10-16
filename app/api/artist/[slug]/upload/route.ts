import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(
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
    .select("id, owner_id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (fetchErr || !artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }
  if (artist.owner_id !== user.id) {
    return NextResponse.json({ error: "Not your profile" }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const kind = (form.get("kind") as string) || "avatar";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Max 4 MB" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only jpg, png, webp, gif" }, { status: 400 });
  }
  if (kind !== "avatar" && kind !== "cover") {
    return NextResponse.json({ error: "kind must be avatar or cover" }, { status: 400 });
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = artist.slug + "/" + kind + "-" + Date.now() + "." + ext;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upErr } = await admin.storage
    .from("artist-covers")
    .upload(path, bytes, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

  if (upErr) {
    console.error("[artist upload]", upErr);
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data: pub } = admin.storage.from("artist-covers").getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  const field = kind === "avatar" ? "avatar_url" : "cover_image";

  const { error: artistUpdateErr } = await admin
    .from("artists")
    .update({ [field]: publicUrl })
    .eq("id", artist.id);

  if (artistUpdateErr) {
    return NextResponse.json({ error: artistUpdateErr.message }, { status: 500 });
  }

  if (kind === "avatar") {
    await admin
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);
  }

  return NextResponse.json({ ok: true, url: publicUrl, kind });
}