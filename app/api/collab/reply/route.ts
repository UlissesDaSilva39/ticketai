import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const b = await req.json();
    if (!b?.post_id || !b?.message) {
      return NextResponse.json({ error: "Missing post_id or message" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("collab_replies")
      .insert({
        post_id: b.post_id,
        author_id: user.id,
        author_name: user.user_metadata?.name || user.email?.split("@")[0] || "Artist",
        message: b.message,
        demo_url: b.demo_url || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, reply: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}