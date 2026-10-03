import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { friendId } = await req.json();
    if (!friendId) return NextResponse.json({ error: "friendId required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    if (user.id === friendId) return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });

    const { data: existing } = await supabase
      .from("friendships")
      .select("id")
      .or("and(user_id.eq." + user.id + ",friend_id.eq." + friendId + "),and(user_id.eq." + friendId + ",friend_id.eq." + user.id + ")")
      .maybeSingle();

    if (existing) {
      await supabase.from("friendships").delete().eq("id", existing.id);
      return NextResponse.json({ status: null });
    }

    await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: friendId,
      status: "pending",
    });
    return NextResponse.json({ status: "accepted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
