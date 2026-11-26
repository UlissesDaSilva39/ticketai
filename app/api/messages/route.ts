import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";
import { checkNewChatAllowance, chatLimitMessage } from "@/lib/chat-limits";
import { checkRateLimit, rateLimitResponse, getClientKey } from "@/lib/rate-limit";

const MAX_BODY = 1000;

// POST /api/messages { toSlug, subject?, body, context? }
// "Message" button on promoter pages: finds the promoter's GRID account by
// username, opens (or reuses) a conversation and sends the first message,
// using the same conversations/messages tables as GRID Messages.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to send a message." }, { status: 401 });

  const rl = checkRateLimit({ key: getClientKey(req, user.id, "messages:promoter"), limit: 10, windowMs: 60_000 });
  if (!rl.ok) return rateLimitResponse(rl.resetAt);

  const { toSlug, subject, body } = await req.json().catch(() => ({}));
  if (!toSlug || typeof toSlug !== "string") return NextResponse.json({ error: "Missing recipient." }, { status: 400 });
  if (typeof body !== "string" || body.trim().length < 5) return NextResponse.json({ error: "Message too short." }, { status: 400 });
  if (body.length > MAX_BODY) return NextResponse.json({ error: "Message too long." }, { status: 400 });

  const admin = createAdminClient();
  const { data: recipient } = await admin.from("profiles").select("id").eq("username", toSlug.toLowerCase()).maybeSingle();
  if (!recipient) {
    return NextResponse.json({ error: "This promoter isn't on GRID Messages yet. Try their contact details instead." }, { status: 404 });
  }
  if (recipient.id === user.id) return NextResponse.json({ error: "Cannot message yourself." }, { status: 400 });

  const a = user.id < recipient.id ? user.id : recipient.id;
  const b = user.id < recipient.id ? recipient.id : user.id;
  const { data: existing } = await supabase.from("conversations").select("id").eq("participant_a", a).eq("participant_b", b).maybeSingle();

  let conversationId = existing?.id as string | undefined;
  if (!conversationId) {
    // New conversation: same weekly limit as GRID Messages.
    const allowance = await checkNewChatAllowance(user.id);
    if (!allowance.ok) return NextResponse.json({ error: chatLimitMessage(allowance), upgrade: "/pro" }, { status: 402 });
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ participant_a: a, participant_b: b, started_by: user.id })
      .select("id")
      .single();
    if (error || !created) return NextResponse.json({ error: "Could not start the conversation." }, { status: 500 });
    conversationId = created.id;
  }

  const text = `${typeof subject === "string" && subject.trim() ? `${subject.trim().slice(0, 120)}\n\n` : ""}${body.trim()}`;
  const { error: msgErr } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: user.id, body: text });
  if (msgErr) return NextResponse.json({ error: "Could not send the message." }, { status: 500 });
  await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", conversationId);

  const { data: me } = await admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
  await notifyServer({
    userId: recipient.id,
    type: "message",
    title: `New message from ${me?.full_name || me?.username || "someone"}`,
    body: text.length > 80 ? `${text.slice(0, 80)}...` : text,
    href: `/messages/${conversationId}`,
  }).catch(() => undefined);

  return NextResponse.json({ ok: true, threadId: conversationId });
}
