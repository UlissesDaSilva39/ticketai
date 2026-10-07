import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEventReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Protect with a shared secret header (set CRON_SECRET in env)
  const authHeader = req.headers.get("authorization");
  const expected = "Bearer " + (process.env.CRON_SECRET || "dev-no-secret");
  if (process.env.CRON_SECRET && authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Test mode: ?test=email@example.com sends a single reminder to that address
  const testEmail = req.nextUrl.searchParams.get("test");
  if (testEmail) {
    await sendEventReminderEmail({
      toEmail: testEmail,
      toName: "Test",
      eventTitle: "Folk & Whisky Festival",
      eventDate: "Thursday, 8 October 2026",
      eventUrl: "http://localhost:3000/event/2a1a8455-e783-468b-8ebd-91210f10a871",
      status: "going",
    });
    return NextResponse.json({ ok: true, test: true, sentTo: testEmail });
  }

  const admin = createAdminClient();

  // Find events starting between 23 and 25 hours from now
  const now = new Date();
  const lower = new Date(now.getTime() + 23 * 60 * 60 * 1000).toISOString();
  const upper = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

  const { data: events, error: eventsError } = await admin
    .from("events")
    .select("id, title, start_date")
    .gte("start_date", lower)
    .lte("start_date", upper)
    .eq("status", "published");

  if (eventsError) {
    return NextResponse.json({ error: eventsError.message }, { status: 500 });
  }

  let sent = 0;
  const siteUrl = process.env.NEXT_PUBLIC_ROOT_URL || "https://ticketai.org.uk";

  for (const ev of events || []) {
    const { data: interested } = await admin
      .from("event_interest")
      .select("user_id, status")
      .eq("event_id", ev.id)
      .in("status", ["going", "interested"]);

    for (const row of interested || []) {
      const { data: authUser } = await admin.auth.admin.getUserById(row.user_id);
      if (!authUser?.user?.email) continue;

      const eventDate = new Date(ev.start_date).toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });

      await sendEventReminderEmail({
        toEmail: authUser.user.email,
        toName: authUser.user.email.split("@")[0],
        eventTitle: ev.title,
        eventDate,
        eventUrl: siteUrl + "/event/" + ev.id,
        status: row.status as "going" | "interested",
      });
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent, eventsProcessed: events?.length ?? 0 });
}
