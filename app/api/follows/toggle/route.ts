import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type Body = {
  targetType: "artist" | "promoter" | "venue" | "user";
  targetId: string;
  following?: boolean;
};

const VALID_TYPES = ["artist", "promoter", "venue", "user"] as const;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const { targetType, targetId, following } = body;

    if (!targetType || !VALID_TYPES.includes(targetType)) {
      return NextResponse.json({ error: "Invalid targetType" }, { status: 400 });
    }
    if (!targetId || typeof targetId !== "string") {
      return NextResponse.json({ error: "Invalid targetId" }, { status: 400 });
    }
    if (targetId === user.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    // Look up current state
    const { data: existing } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();

    const shouldFollow = typeof following === "boolean" ? following : !existing;

    if (shouldFollow && !existing) {
      const { error } = await supabase
        .from("follows")
        .insert({
          follower_id: user.id,
          target_type: targetType,
          target_id: targetId,
        });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else if (!shouldFollow && existing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("id", existing.id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Return the fresh count
    const { count } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("target_type", targetType)
      .eq("target_id", targetId);

    return NextResponse.json({
      following: shouldFollow,
      count: count ?? 0,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}