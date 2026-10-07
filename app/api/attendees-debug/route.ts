import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

  const admin = createAdminClient();

  const { data: tickets } = await admin
    .from("tickets")
    .select("user_id, status")
    .eq("event_id", eventId)
    .in("status", ["valid", "used"]);

  const userIdSet = new Set<string>();
  for (const t of tickets || []) userIdSet.add(t.user_id);

  const { data: going } = await admin
    .from("event_interest")
    .select("user_id")
    .eq("event_id", eventId)
    .eq("status", "going");

  for (const g of going || []) userIdSet.add(g.user_id);

  const userIds = Array.from(userIdSet);

  let profiles: Array<{ id: string; full_name: string | null; username: string | null }> = [];
  if (userIds.length > 0) {
    const { data } = await admin
      .from("profiles")
      .select("id, full_name, username")
      .in("id", userIds);
    profiles = data || [];
  }

  return NextResponse.json({
    ticketCount: tickets?.length ?? 0,
    uniqueUserIds: userIds,
    profileCount: profiles.length,
    profiles,
  });
}