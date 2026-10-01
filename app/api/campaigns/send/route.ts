import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { audienceType, eventId, subject, body } = await req.json();
    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body required" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Get event IDs for this organizer
    let eventIds: string[] = [];
    if (audienceType === "event" && eventId) {
      const { data: ev } = await admin
        .from("events")
        .select("id")
        .eq("id", eventId)
        .eq("organizer_id", user.id)
        .maybeSingle();
      if (!ev) return NextResponse.json({ error: "Event not found" }, { status: 404 });
      eventIds = [ev.id];
    } else {
      const { data: evs } = await admin
        .from("events")
        .select("id")
        .eq("organizer_id", user.id);
      eventIds = (evs || []).map((e: { id: string }) => e.id);
    }

    if (eventIds.length === 0) {
      return NextResponse.json({ error: "No events found" }, { status: 400 });
    }

    // Get unique attendees
    const { data: tickets } = await admin
      .from("tickets")
      .select("user_id")
      .in("event_id", eventIds);

    const userIds = [...new Set((tickets || []).map((t: { user_id: string }) => t.user_id).filter(Boolean))];

    if (userIds.length === 0) {
      return NextResponse.json({ error: "No attendees to email yet" }, { status: 400 });
    }

    // Get emails
    const emails: string[] = [];
    for (const uid of userIds.slice(0, 100)) {
      try {
        const { data } = await admin.auth.admin.getUserById(uid);
        if (data?.user?.email) emails.push(data.user.email);
      } catch {}
    }

    // Create campaign record
    const { data: campaign } = await admin
      .from("campaigns")
      .insert({
        organizer_id: user.id,
        event_id: audienceType === "event" ? eventId : null,
        audience_type: audienceType || "all",
        subject,
        body,
        recipient_count: emails.length,
        status: "sending",
      })
      .select()
      .single();

    if (!campaign) return NextResponse.json({ error: "Failed to log campaign" }, { status: 500 });

    // Send emails
    let successful = 0;
    let failed = 0;
    const html = "<div style=\"font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;\">" +
      "<h1 style=\"font-size: 24px; margin: 0 0 16px 0;\">" + subject + "</h1>" +
      "<div style=\"font-size: 15px; line-height: 1.7; color: #333; white-space: pre-wrap;\">" + body + "</div>" +
      "<hr style=\"margin: 32px 0; border: none; border-top: 1px solid #eee;\">" +
      "<p style=\"font-size: 12px; color: #999; text-align: center;\">Sent via TicketAI</p>" +
      "</div>";

    for (const email of emails) {
      try {
        const { error } = await resend.emails.send({
          from: "TicketAI <onboarding@resend.dev>",
          to: email,
          subject,
          html,
        });
        if (error) { failed++; } else { successful++; }
      } catch {
        failed++;
      }
    }

    // Update campaign record
    await admin
      .from("campaigns")
      .update({
        successful_sends: successful,
        failed_sends: failed,
        status: successful > 0 ? "sent" : "failed",
        sent_at: new Date().toISOString(),
      })
      .eq("id", campaign.id);

    return NextResponse.json({
      campaignId: campaign.id,
      recipients: emails.length,
      successful,
      failed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

