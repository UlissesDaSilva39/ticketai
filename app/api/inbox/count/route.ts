import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ unread: 0, signedIn: false });
    }

    let total = 0;

    // --- Artist messages ---
    const { data: myArtists } = await supabase
      .from("artists")
      .select("slug")
      .eq("owner_id", user.id);
    const slugs = (myArtists ?? []).map((a) => a.slug);
    if (slugs.length > 0) {
      const { count } = await supabase
        .from("artist_messages")
        .select("*", { count: "exact", head: true })
        .in("artist_slug", slugs)
        .is("read_at", null);
      total += count ?? 0;
    }

    // --- Promoter messages ---
    const { data: myProms } = await supabase
      .from("promoters")
      .select("id")
      .eq("user_id", user.id);
    const pids = (myProms ?? []).map((p) => p.id);
    if (pids.length > 0) {
      const { count } = await supabase
        .from("promoter_messages")
        .select("*", { count: "exact", head: true })
        .in("promoter_id", pids)
        .is("read_at", null);
      total += count ?? 0;
    }

    // --- Direct messages ---
    const { count: dc } = await supabase
      .from("user_messages")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", user.id)
      .is("read_at", null);
    total += dc ?? 0;

    return NextResponse.json({ unread: total, signedIn: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: msg, unread: 0 }, { status: 500 });
  }
}