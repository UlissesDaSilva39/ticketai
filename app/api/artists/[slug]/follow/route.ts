import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const shouldFollow = body.following === true;

  if (shouldFollow) {
    const { error } = await supabase
      .from("artist_follows")
      .insert({ follower_id: user.id, artist_slug: slug })
      .select();

    if (error && !error.message.includes("duplicate")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase
      .from("artist_follows")
      .delete()
      .eq("follower_id", user.id)
      .eq("artist_slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const { count } = await supabase
    .from("artist_follows")
    .select("*", { count: "exact", head: true })
    .eq("artist_slug", slug);

  return NextResponse.json({ following: shouldFollow, count: count ?? 0 });
}
