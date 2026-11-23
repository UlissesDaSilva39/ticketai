import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyServer } from "@/lib/notify-server";
import { rateLimit } from "@/lib/rate-limit";
import { isOpen, type Opportunity } from "@/lib/matching";

export const dynamic = "force-dynamic";

// Apply to an opportunity = send its poster a message (existing conversations/messages)
// plus an in-app notification. No separate applications table yet.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!rateLimit(`apply:${user.id}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "You've applied a lot in the last hour. Try again later." }, { status: 429 });
  }

  let body: { opportunityId?: string; note?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const note = String(body.note ?? "").trim().slice(0, 1000);
  if (!body.opportunityId) return NextResponse.json({ error: "opportunityId required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: opp } = await admin
    .from("opportunities")
    .select("id, title, org, category, location, remote, compensation, description, deadline, created_by, created_at")
    .eq("id", body.opportunityId)
    .maybeSingle();
  if (!opp) return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  const o = opp as Opportunity;
  if (!isOpen(o)) return NextResponse.json({ error: "This opportunity has closed." }, { status: 400 });
  if (!o.created_by) return NextResponse.json({ error: "This listing can't take applications yet." }, { status: 400 });
  if (o.created_by === user.id) return NextResponse.json({ error: "That's your own listing." }, { status: 400 });

  // Find or create the 1:1 conversation (same ordering rule as /api/messages/start).
  const a = user.id < o.created_by ? user.id : o.created_by;
  const b = user.id < o.created_by ? o.created_by : user.id;
  let conversationId: string | null = null;
  const { data: existing } = await admin
    .from("conversations")
    .select("id")
    .eq("participant_a", a)
    .eq("participant_b", b)
    .maybeSingle();
  if (existing) {
    conversationId = existing.id;
  } else {
    const { data: created, error } = await admin
      .from("conversations")
      .insert({ participant_a: a, participant_b: b })
      .select("id")
      .single();
    if (error || !created) return NextResponse.json({ error: "Could not contact the poster." }, { status: 500 });
    conversationId = created.id;
  }

  const text =
    `📩 Application: ${o.title}${o.org ? ` (${o.org})` : ""}\n\n` +
    (note || "Hi! I'm interested in this opportunity. Take a look at my profile and let me know.") +
    `\n\n— Sent from Matched For You on GRID`;

  const { error: msgError } = await admin.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: text,
  });
  if (msgError) return NextResponse.json({ error: "Could not send your application." }, { status: 500 });

  const { data: me } = await admin.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
  const name = (me?.full_name && !me.full_name.includes("@") ? me.full_name : me?.username) || "Someone";
  await notifyServer({
    userId: o.created_by,
    type: "message",
    title: `${name} applied to “${o.title}”`,
    body: note ? note.slice(0, 80) : null,
    href: "/messages/" + conversationId,
  });

  return NextResponse.json({ ok: true, conversationId });
}
