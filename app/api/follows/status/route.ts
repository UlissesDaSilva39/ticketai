import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const VALID_TYPES = ["artist", "promoter", "venue", "user"] as const;

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const url = new URL(req.url);
    const targetType = url.searchParams.get("targetType") || "";
    const targetId = url.searchParams.get("targetId") || "";

    if (!VALID_TYPES.includes(targetType as typeof VALID_TYPES[number])) {
      return NextResponse.json({ error: "Invalid targetType" }, { status: 400 });
    }
    if (!targetId) {
      return NextResponse.json({ error: "Missing targetId" }, { status: 400 });
    }

    const { count } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("target_type", targetType)
      .eq("target_id", targetId);

    const { data: { user } } = await supabase.auth.getUser();
    let following = false;
    if (user) {
      const { data } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user.id)
        .eq("target_type", targetType)
        .eq("target_id", targetId)
        .maybeSingle();
      following = !!data;
    }

    return NextResponse.json({ following, count: count ?? 0 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}