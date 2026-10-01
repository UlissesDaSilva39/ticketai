import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { organizerId } = await req.json();
    if (!organizerId) return NextResponse.json({ error: "organizerId required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in to follow" }, { status: 401 });
    if (user.id === organizerId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });

    const admin = createAdminClient();

    const { data: existing } = await admin
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("organizer_id", organizerId)
      .maybeSingle();

    let following = false;
    if (existing) {
      await admin.from("follows").delete().eq("id", existing.id);
      following = false;
    } else {
      await admin.from("follows").insert({ follower_id: user.id, organizer_id: organizerId });
      following = true;
    }

    const { count } = await admin
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("organizer_id", organizerId);

    return NextResponse.json({ following, count: count || 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

