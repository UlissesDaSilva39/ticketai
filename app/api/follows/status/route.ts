import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const targetType = req.nextUrl.searchParams.get("targetType");
  const targetId = req.nextUrl.searchParams.get("targetId");

  if (!targetType || !targetId) {
    return NextResponse.json(
      { error: "targetType and targetId required" },
      { status: 400 }
    );
  }

  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  let following = false;
  if (user) {
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();
    following = Boolean(data);
  }

  return NextResponse.json({
    following,
    count: count ?? 0,
    signedIn: Boolean(user),
  });
}