import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { eventId } = await req.json();
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in to like events" }, { status: 401 });

    const admin = createAdminClient();

    const { data: existing } = await admin
      .from("event_likes")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .maybeSingle();

    let liked = false;
    if (existing) {
      await admin.from("event_likes").delete().eq("id", existing.id);
      liked = false;
    } else {
      await admin.from("event_likes").insert({ event_id: eventId, user_id: user.id });
      liked = true;
    }

    const { count } = await admin
      .from("event_likes")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    return NextResponse.json({ liked, count: count || 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
