import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("collab_posts")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ posts: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const b = await req.json();
    if (!b?.role_needed || !b?.description) {
      return NextResponse.json({ error: "Missing role_needed or description" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("collab_posts")
      .insert({
        author_id: user.id,
        author_name: user.user_metadata?.name || user.email?.split("@")[0] || "Artist",
        role_needed: b.role_needed,
        genre: b.genre || null,
        bpm: b.bpm ? Number(b.bpm) : null,
        description: b.description,
        reference_url: b.reference_url || null,
        status: "open",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, post: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}