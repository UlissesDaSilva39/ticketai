import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { notifyServer } from "@/lib/notify-server";

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

    let resolvedTargetId: string | null = null;
    let ownerId: string | null = null;

    if (targetType === "promoter") {
      const { data } = await supabase
        .from("promoters")
        .select("id, user_id")
        .or(`id.eq.${targetId},user_id.eq.${targetId}`)
        .maybeSingle();

      if (data) {
        resolvedTargetId = data.id;
        ownerId = data.user_id;
      }
    } else {
      const { data } = await supabase
        .from("venues")
        .select("id, organizer_id")
        .eq("id", targetId)
        .maybeSingle();

      if (data) {
        resolvedTargetId = data.id;
        ownerId = data.organizer_id;
      }
    }

    if (!resolvedTargetId) {
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
      .eq("target_id", resolvedTargetId)
      .maybeSingle();

    let following = false;
    if (existing) {
      await supabase.from("follows").delete().eq("id", existing.id);
      following = false;
    } else {
      await supabase.from("follows").insert({
        follower_id: user.id,
        target_type: targetType,
        target_id: resolvedTargetId,
      });
      following = true;

      // Notify the target's owner (only on follow, not unfollow)
      if (ownerId) {
        const { data: followerProfile } = await supabase
          .from("profiles")
          .select("full_name, username")
          .eq("id", user.id)
          .maybeSingle();

        const followerName = followerProfile?.full_name || followerProfile?.username || "Someone";
        const followerUsername = followerProfile?.username || null;

        await notifyServer({
          userId: ownerId,
          type: "follow",
          title: "New follower",
          body: followerName + " started following you",
          href: targetType === "promoter"
            ? "/promoters/" + resolvedTargetId
            : "/venues/" + resolvedTargetId,
        });
      }
    }

    const { count } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("target_type", targetType)
      .eq("target_id", resolvedTargetId);

    return NextResponse.json({ following, count: count || 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
