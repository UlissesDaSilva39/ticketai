import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { UUID, currentUser } from "@/lib/live/server";

export const dynamic = "force-dynamic";

// POST /api/live/<id>/chat { body }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Log in to chat." }, { status: 401 });
  if (!UUID.test(id)) return NextResponse.json({ error: "Live not found." }, { status: 404 });
  if (!rateLimit(`live-chat:${user.id}`, 20, 60_000).ok) return NextResponse.json({ error: "Slow down a little 🙂" }, { status: 429 });

  const { body } = await req.json().catch(() => ({}));
  const text = String(body ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
  if (!text) return NextResponse.json({ error: "Type a message." }, { status: 400 });

  const admin = createAdminClient();
  const { data: s } = await admin.from("live_streams").select("status").eq("id", id).maybeSingle();
  if (!s) return NextResponse.json({ error: "Live not found." }, { status: 404 });
  if (s.status === "ended") return NextResponse.json({ error: "This live has ended." }, { status: 409 });

  const { error } = await admin.from("live_messages").insert({ stream_id: id, user_id: user.id, kind: "chat", body: text });
  if (error) return NextResponse.json({ error: "Couldn't send. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
