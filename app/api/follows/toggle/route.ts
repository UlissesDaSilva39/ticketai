import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { targetType?: string; targetId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { targetType, targetId } = body;
  if (!targetType || !targetId) {
    return NextResponse.json({ error: "targetType and targetId required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  let nowFollowing: boolean;
  if (existing) {
    const { error } = await supabase.from("follows").delete().eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    nowFollowing = false;
  } else {
    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      target_type: targetType,
      target_id: targetId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    nowFollowing = true;
  }

  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  return NextResponse.json({ following: nowFollowing, count: count ?? 0 });
}
