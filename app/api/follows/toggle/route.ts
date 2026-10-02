import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { targetType, targetId } = (body ?? {}) as {
      targetType?: "promoter" | "venue";
      targetId?: string;
    };

    if (!targetType || !targetId) {
      return NextResponse.json(
        { error: "targetType and targetId required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to follow" },
        { status: 401 }
      );
    }

    let ownerId: string | null = null;
    if (targetType === "promoter") {
      const { data } = await supabase
        .from("promoters")
        .select("user_id")
        .eq("id", targetId)
        .maybeSingle();
      ownerId = data?.user_id ?? null;
    } else {
      const { data } = await supabase
        .from("venues")
        .select("organizer_id")
        .eq("id", targetId)
        .maybeSingle();
      ownerId = data?.organizer_id ?? null;
    }

    if (!ownerId) {
      return NextResponse.json({ error: "Target not found" }, { status: 404 });
    }
    if (ownerId === user.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();

    let following = false;
    if (existing) {
      await supabase.from("follows").delete().eq("id", existing.id);
      following = false;
    } else {
      await supabase.from("follows").insert({
        follower_id: user.id,
        target_type: targetType,
        target_id: targetId,
      });
      following = true;
    }

    const { count } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("target_type", targetType)
      .eq("target_id", targetId);

    return NextResponse.json({ following, count: count || 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}