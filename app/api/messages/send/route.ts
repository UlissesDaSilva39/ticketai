import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewMessageEmail } from "@/lib/email";
import { notifyServer } from "@/lib/notify-server";
import { checkRateLimit, rateLimitResponse, getClientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const { conversationId, body, attachment_url, attachment_type } = await req.json();
    if (!conversationId || ((!body || !body.trim()) && !attachment_url)) {
      return NextResponse.json({ error: "conversationId and body or attachment required" }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const rl = checkRateLimit({
      key: getClientKey(req, user.id, "messages:send"),
      limit: 20,
      windowMs: 60_000,
    });
    if (!rl.ok) return rateLimitResponse(rl.resetAt);

    const { data: conv } = await supabase
      .from("conversations")
      .select("id, participant_a, participant_b")
      .eq("id", conversationId)
      .maybeSingle();

    if (!conv) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    if (conv.participant_a !== user.id && conv.participant_b !== user.id) {
      return NextResponse.json({ error: "Not your conversation" }, { status: 403 });
    }

    const text = (body ?? "").trim();

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: text || " ",
        attachment_url: attachment_url ?? null,
        attachment_type: attachment_type ?? null,
      })
      .select("id, body, sender_id, created_at")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);

    const recipientId = conv.participant_a === user.id ? conv.participant_b : conv.participant_a;

    // Look up sender profile once
    const admin = createAdminClient();
    const { data: senderProfile } = await admin
      .from("profiles")
      .select("full_name, username")
      .eq("id", user.id)
      .maybeSingle();

    const senderName = senderProfile?.full_name || senderProfile?.username || "Someone";
    const senderUsername = senderProfile?.username || null;
    const preview = text.length > 80 ? text.slice(0, 80) + "..." : text;

    // In-app notification
    await notifyServer({
      userId: recipientId,
      type: "message",
      title: "New message from " + senderName,
      body: preview,
      href: "/messages/" + conversationId,
    });

    // Email (fire-and-forget)
    try {
      const { data: recipientAuth } = await admin.auth.admin.getUserById(recipientId);

      if (recipientAuth?.user?.email) {
        const siteUrl = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";
        await sendNewMessageEmail({
          toEmail: recipientAuth.user.email,
          toName: recipientAuth.user.email.split("@")[0],
          fromName: senderName,
          fromUsername: senderUsername,
          messagePreview: text.length > 200 ? text.slice(0, 200) + "..." : text,
          conversationUrl: siteUrl + "/messages/" + conversationId,
        });
      }
    } catch (e) {
      console.error("Failed to send new message email:", e);
    }

    return NextResponse.json({ message: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
