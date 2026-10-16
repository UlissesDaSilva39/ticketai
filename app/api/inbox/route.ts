import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type UnifiedMessage = {
  id: string;
  source: "artist" | "promoter" | "direct";
  sender_name: string;
  sender_email: string;
  message: string;
  read_at: string | null;
  created_at: string;
  context: string | null;
};

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const out: UnifiedMessage[] = [];

    // ---- Artist messages: my artist profiles ----
    const { data: myArtists } = await supabase
      .from("artists")
      .select("slug, name")
      .eq("owner_id", user.id);

    const mySlugs = (myArtists ?? []).map((a) => a.slug);
    if (mySlugs.length > 0) {
      const { data: arts } = await supabase
        .from("artist_messages")
        .select("id, artist_slug, name, email, message, read_at, created_at")
        .in("artist_slug", mySlugs)
        .order("created_at", { ascending: false })
        .limit(200);

      const nameBySlug = new Map((myArtists ?? []).map((a) => [a.slug, a.name]));
      for (const m of arts ?? []) {
        out.push({
          id: m.id,
          source: "artist",
          sender_name: m.name,
          sender_email: m.email,
          message: m.message,
          read_at: m.read_at,
          created_at: m.created_at,
          context: nameBySlug.get(m.artist_slug) ?? null,
        });
      }
    }

    // ---- Promoter messages: my promoter profiles ----
    const { data: myPromoters } = await supabase
      .from("promoters")
      .select("id, display_name")
      .eq("user_id", user.id);

    const promoterIds = (myPromoters ?? []).map((p) => p.id);
    if (promoterIds.length > 0) {
      const { data: proms } = await supabase
        .from("promoter_messages")
        .select("id, promoter_id, name, email, message, read_at, created_at")
        .in("promoter_id", promoterIds)
        .order("created_at", { ascending: false })
        .limit(200);

      const nameByPid = new Map((myPromoters ?? []).map((p) => [p.id, p.display_name]));
      for (const m of proms ?? []) {
        out.push({
          id: m.id,
          source: "promoter",
          sender_name: m.name,
          sender_email: m.email,
          message: m.message,
          read_at: m.read_at,
          created_at: m.created_at,
          context: nameByPid.get(m.promoter_id) ?? null,
        });
      }
    }

    // ---- Direct messages (user_messages) ----
    const { data: directs } = await supabase
      .from("user_messages")
      .select("id, sender_name, sender_email, message, read_at, created_at")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200);

    for (const m of directs ?? []) {
      out.push({
        id: m.id,
        source: "direct",
        sender_name: m.sender_name,
        sender_email: m.sender_email,
        message: m.message,
        read_at: m.read_at,
        created_at: m.created_at,
        context: null,
      });
    }

    out.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const counts = {
      all: out.length,
      artist: out.filter((m) => m.source === "artist").length,
      promoter: out.filter((m) => m.source === "promoter").length,
      direct: out.filter((m) => m.source === "direct").length,
      unread: out.filter((m) => !m.read_at).length,
    };

    return NextResponse.json({ messages: out, counts });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}