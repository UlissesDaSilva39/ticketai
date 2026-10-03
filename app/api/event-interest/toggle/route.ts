import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { eventId, status } = await req.json();
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { data: existing } = await supabase
      .from("event_interest")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("event_id", eventId)
      .maybeSingle();

    if (existing) {
      if (!status || existing.status === status) {
        await supabase.from("event_interest").delete().eq("id", existing.id);
        return NextResponse.json({ status: null });
      }
      await supabase.from("event_interest").update({ status }).eq("id", existing.id);
      return NextResponse.json({ status });
    }

    await supabase.from("event_interest").insert({
      user_id: user.id,
      event_id: eventId,
      status: status || "interested",
    });
    return NextResponse.json({ status: status || "interested" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
