import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { eventId } = await req.json();
    if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    console.log("[reviews/delete] called for eventId=", eventId, "userId=", user.id);
    const { error } = await supabase
      .from("event_reviews")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);

    if (error) { console.error("[reviews/delete] error:", error); return NextResponse.json({ error: error.message }, { status: 500 }); }
    console.log("[reviews/delete] success");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
