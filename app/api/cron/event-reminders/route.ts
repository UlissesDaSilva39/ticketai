import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEventReminderEmail } from "@/lib/email";
import { notifyServer } from "@/lib/notify-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const querySecret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.CRON_SECRET || "dev-no-secret";
  const provided =
    (authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null) ||
    querySecret;
  if (process.env.CRON_SECRET && provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Test mode: ?test=email@example.com sends a single reminder
  const testEmail = req.nextUrl.searchParams.get("test");
  if (testEmail) {
    await sendEventReminderEmail({
      toEmail: testEmail,
      toName: "Test",
      eventTitle: "Folk & Whisky Festival",
      eventDate: "Thursday, 8 October 2026",
      eventUrl: "http://localhost:3000/events/2a1a8455-e783-468b-8ebd-91210f10a871",
      status: "going",
    });
    return NextResponse.json({ ok: true, test: true, sentTo: testEmail });
  }

  const admin = createAdminClient();
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const siteUrl = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";
  let reminders24 = 0;
  let reminders2 = 0;
  let reviews = 0;
  let eventsProcessed = 0;

  // ---------- 24h reminder ----------
  const { data: events24 } = await admin
    .from("events")
    .select("id, title, start_date")
    .eq("status", "published")
    .gte("start_date", now.toISOString())
    .lte("start_date", in24h.toISOString());

  for (const ev of events24 ?? []) {
    eventsProcessed++;
    const { data: tickets } = await admin
      .from("tickets")
      .select("user_id")
      .eq("event_id", ev.id)
      .in("status", ["valid", "used"]);

    const userIds = Array.from(new Set((tickets ?? []).map((t) => t.user_id)));

    for (const uid of userIds) {
      const { data: existing } = await admin
        .from("reminders_sent")
        .select("id")
        .eq("event_id", ev.id)
        .eq("user_id", uid)
        .eq("kind", "reminder_24h")
        .maybeSingle();
      if (existing) continue;

      await notifyServer({
        userId: uid,
        type: "event_reminder",
        title: "Tomorrow: " + ev.title,
        body: "Your event starts in less than 24 hours.",
        href: "/events/" + ev.id,
      });

      const { data: authUser } = await admin.auth.admin.getUserById(uid);
      if (authUser?.user?.email) {
        const eventDate = new Date(ev.start_date).toLocaleDateString("en-GB", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        });
        try {
          await sendEventReminderEmail({
            toEmail: authUser.user.email,
            toName: authUser.user.email.split("@")[0],
            eventTitle: ev.title,
            eventDate,
            eventUrl: siteUrl + "/events/" + ev.id,
            status: "going",
          });
        } catch (e) {
          console.error("[reminder-24h] email failed:", e);
        }
      }

      await admin.from("reminders_sent").insert({
        event_id: ev.id, user_id: uid, kind: "reminder_24h",
      });
      reminders24++;
    }
  }

  // ---------- 2h reminder ----------
  const { data: events2 } = await admin
    .from("events")
    .select("id, title, start_date")
    .eq("status", "published")
    .gte("start_date", now.toISOString())
    .lte("start_date", in2h.toISOString());

  for (const ev of events2 ?? []) {
    const { data: tickets } = await admin
      .from("tickets")
      .select("user_id")
      .eq("event_id", ev.id)
      .in("status", ["valid", "used"]);

    const userIds = Array.from(new Set((tickets ?? []).map((t) => t.user_id)));

    for (const uid of userIds) {
      const { data: existing } = await admin
        .from("reminders_sent")
        .select("id")
        .eq("event_id", ev.id)
        .eq("user_id", uid)
        .eq("kind", "reminder_2h")
        .maybeSingle();
      if (existing) continue;

      await notifyServer({
        userId: uid,
        type: "event_reminder",
        title: "Starting soon: " + ev.title,
        body: "Your event starts in less than 2 hours.",
        href: "/events/" + ev.id,
      });

      await admin.from("reminders_sent").insert({
        event_id: ev.id, user_id: uid, kind: "reminder_2h",
      });
      reminders2++;
    }
  }

  // ---------- Post-event review request ----------
  const { data: eventsDone } = await admin
    .from("events")
    .select("id, title")
    .eq("status", "published")
    .gte("start_date", ago48h.toISOString())
    .lte("start_date", ago24h.toISOString());

  for (const ev of eventsDone ?? []) {
    const { data: tickets } = await admin
      .from("tickets")
      .select("user_id")
      .eq("event_id", ev.id)
      .eq("status", "used");

    const userIds = Array.from(new Set((tickets ?? []).map((t) => t.user_id)));

    for (const uid of userIds) {
      const { data: existing } = await admin
        .from("reminders_sent")
        .select("id")
        .eq("event_id", ev.id)
        .eq("user_id", uid)
        .eq("kind", "review_request")
        .maybeSingle();
      if (existing) continue;

      await notifyServer({
        userId: uid,
        type: "review_request",
        title: "How was " + ev.title + "?",
        body: "Leave a quick review to help other attendees.",
        href: "/events/" + ev.id,
      });

      await admin.from("reminders_sent").insert({
        event_id: ev.id, user_id: uid, kind: "review_request",
      });
      reviews++;
    }
  }

  return NextResponse.json({
    ok: true,
    reminders24,
    reminders2,
    reviews,
    eventsProcessed,
    ranAt: new Date().toISOString(),
  });
}