import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyMembers } from "@/lib/backstage/server";
import { cleanHttpsUrl } from "@/lib/ads/server";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// POST /api/backstage/posts { body, mediaUrl }: a members-only post (members are notified).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!rateLimit(`backstage-post:${user.id}`, 20, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  const body = typeof b.body === "string" ? b.body.trim() : "";
  if (!body || body.length > 5000) return NextResponse.json({ error: "Write something for your members." }, { status: 400 });
  const media = b.mediaUrl ? cleanHttpsUrl(b.mediaUrl) : null;
  const admin = createAdminClient();
  const { data: tiers } = await admin.from("backstage_tiers").select("id").eq("artist_id", user.id).eq("active", true).limit(1);
  if (!tiers?.length) return NextResponse.json({ error: "Set up a membership first." }, { status: 400 });
  const { data, error } = await admin.from("backstage_posts").insert({ artist_id: user.id, body, media_url: media }).select("id, body, media_url, created_at").single();
  if (error) return NextResponse.json({ error: "Couldn't post." }, { status: 500 });
  const { data: p } = await admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
  await notifyMembers(user.id, (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) ?? "An artist", body).catch(() => undefined);
  return NextResponse.json({ post: data });
}
