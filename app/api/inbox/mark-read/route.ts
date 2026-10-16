import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    let body: { id?: string; source?: string } = {};
    try { body = await req.json(); } catch { /* ignore */ }

    const { id, source } = body;
    if (!id || !source) {
      return NextResponse.json({ error: "Missing id or source" }, { status: 400 });
    }

    const readAt = new Date().toISOString();

    if (source === "direct") {
      await supabase
        .from("user_messages")
        .update({ read_at: readAt })
        .eq("id", id)
        .eq("recipient_id", user.id);
    } else if (source === "promoter") {
      const { data: myPromoters } = await supabase
        .from("promoters").select("id").eq("user_id", user.id);
      const ids = (myPromoters ?? []).map((p) => p.id);
      if (ids.length > 0) {
        await supabase
          .from("promoter_messages")
          .update({ read_at: readAt })
          .eq("id", id)
          .in("promoter_id", ids);
      }
    } else if (source === "artist") {
      const { data: myArtists } = await supabase
        .from("artists").select("slug").eq("owner_id", user.id);
      const slugs = (myArtists ?? []).map((a) => a.slug);
      if (slugs.length > 0) {
        await supabase
          .from("artist_messages")
          .update({ read_at: readAt })
          .eq("id", id)
          .in("artist_slug", slugs);
      }
    }

    return NextResponse.json({ ok: true, read_at: readAt });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}