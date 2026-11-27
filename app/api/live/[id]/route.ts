import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";
import { UUID, currentUser, displayName } from "@/lib/live/server";

export const dynamic = "force-dynamic";

// PATCH /api/live/<id> { action: "start" | "end" } or { pinProductId }: host controls.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  if (!UUID.test(id)) return NextResponse.json({ error: "Live not found." }, { status: 404 });

  const admin = createAdminClient();
  const { data: s } = await admin.from("live_streams").select("id, host_id, status, title").eq("id", id).maybeSingle();
  if (!s || s.host_id !== user.id) return NextResponse.json({ error: "Live not found." }, { status: 404 });
  const b = await req.json().catch(() => ({}));

  if (b.action === "start") {
    if (s.status !== "scheduled") return NextResponse.json({ error: "This live has already started or ended." }, { status: 409 });
    await admin.from("live_streams").update({ status: "live", started_at: new Date().toISOString() }).eq("id", id);
    await admin.from("live_messages").insert({ stream_id: id, kind: "system", body: "The live has started. Say hi! 👋" });
    // Tell the host's followers (best effort, same follows table as the rest of GRID).
    const { data: me } = await admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
    const { data: followers } = await admin.from("follows").select("follower_id").eq("target_type", "user").eq("target_id", user.id).limit(1000);
    for (const f of followers ?? []) {
      await notifyServer({ userId: f.follower_id, type: "live", title: `🔴 ${displayName(me)} is live: ${s.title}`, body: "Join now and send a gift.", href: `/live/${id}` }).catch(() => undefined);
    }
    return NextResponse.json({ status: "live" });
  }
  if (b.action === "end") {
    if (s.status === "ended") return NextResponse.json({ status: "ended" });
    await admin.from("live_streams").update({ status: "ended", ended_at: new Date().toISOString() }).eq("id", id);
    await admin.from("live_messages").insert({ stream_id: id, kind: "system", body: "The live has ended. Thanks for watching! 🎶" });
    return NextResponse.json({ status: "ended" });
  }
  if (typeof b.pinProductId === "string" && UUID.test(b.pinProductId)) {
    const { data: p } = await admin.from("live_products").select("id, title").eq("id", b.pinProductId).eq("stream_id", id).maybeSingle();
    if (!p) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    await admin.from("live_products").update({ pinned: false }).eq("stream_id", id);
    await admin.from("live_products").update({ pinned: true }).eq("id", p.id);
    await admin.from("live_messages").insert({ stream_id: id, kind: "system", body: `📌 Pinned: ${p.title}`.slice(0, 300) });
    return NextResponse.json({ pinned: p.id });
  }
  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
