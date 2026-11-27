import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isVerdict } from "@/lib/submissions/catalog";
import { notifyServer } from "@/lib/notify-server";

export const dynamic = "force-dynamic";

// POST /api/submit/<id>/reply { verdict, reply }: the reviewer answers (and earns their share).
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { verdict, reply } = await req.json().catch(() => ({}));
  const text = typeof reply === "string" ? reply.trim() : "";
  if (!isVerdict(verdict) || text.length < 20 || text.length > 2000) {
    return NextResponse.json({ error: "Pick a verdict and write at least a couple of sentences (20+ characters)." }, { status: 400 });
  }
  const admin = createAdminClient();
  const { data: s } = await admin.from("submissions").select("id, reviewer_id, sender_id, status, due_at, kind, title").eq("id", id).maybeSingle();
  if (!s || s.reviewer_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (s.status !== "sent") return NextResponse.json({ error: s.status === "replied" ? "You've already replied." : "This one was refunded because the reply time ran out." }, { status: 409 });
  if (s.due_at && new Date(s.due_at) < new Date()) return NextResponse.json({ error: "The reply time ran out, so the sender is being refunded." }, { status: 409 });
  const { data: done } = await admin
    .from("submissions")
    .update({ status: "replied", verdict, reply: text, replied_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "sent")
    .select("id")
    .maybeSingle();
  if (!done) return NextResponse.json({ error: "Couldn't save your reply." }, { status: 409 });
  await notifyServer({ userId: s.sender_id, type: "messages", title: s.kind === "demo" ? `Feedback on "${s.title ?? "your track"}"` : "You got a reply to your priority message", body: text.slice(0, 120), href: "/submit?tab=sent" }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
