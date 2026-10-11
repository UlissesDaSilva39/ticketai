import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Not signed in" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action === "unfollow" ? "unfollow" : "follow";

    if (action === "follow") {
      const { error } = await supabase
        .from("artist_follows")
        .insert({ follower_id: user.id, artist_slug: slug });

      if (error && !error.message.toLowerCase().includes("duplicate")) {
        console.error("follow insert failed:", error);
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }
    } else {
      const { error } = await supabase
        .from("artist_follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("artist_slug", slug);

      if (error) {
        console.error("unfollow delete failed:", error);
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }
    }

    const { count } = await supabase
      .from("artist_follows")
      .select("*", { count: "exact", head: true })
      .eq("artist_slug", slug);

    return NextResponse.json({
      ok: true,
      following: action === "follow",
      count: count ?? 0,
    });
  } catch (err) {
    console.error("follow route error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
