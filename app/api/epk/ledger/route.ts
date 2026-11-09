import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch all remixes where this user is the remixer
    const { data: asRemixer } = await supabase
      .from("remix_requests")
      .select("id, status, proposed_split")
      .eq("remixer_id", user.id);

    // Fetch all remixes where this user is the original artist
    const userSlug = user.user_metadata?.slug || user.email?.split("@")[0] || "";
    const { data: asOriginal } = await supabase
      .from("remix_requests")
      .select("id, status, proposed_split")
      .eq("original_artist_slug", userSlug);

    const allRemixes = [...(asRemixer || []), ...(asOriginal || [])];
    const releasedIds = allRemixes.filter(r => r.status === 'released').map(r => r.id);

    let totalEarnedCents = 0;
    const transactions = [];

    if (releasedIds.length > 0) {
      const { data: ledger } = await supabase
        .from("revenue_ledger")
        .select("*")
        .in("remix_request_id", releasedIds)
        .order("created_at", { ascending: false });

      if (ledger) {
        for (const entry of ledger) {
          const remix = allRemixes.find(r => r.id === entry.remix_request_id);
          if (!remix) continue;

          // Determine if user is remixer or original for this specific entry
          const isRemixer = asRemixer?.some(r => r.id === entry.remix_request_id);
          const split = remix.proposed_split || { original_pct: 30, remixer_pct: 60, platform_pct: 10 };
          
          // Calculate user's cut
          const pct = isRemixer ? split.remixer_pct : split.original_pct;
          const myCut = Math.floor((entry.amount_cents * pct) / 100);
          
          totalEarnedCents += myCut;
          transactions.push({
            id: entry.id,
            amount_cents: entry.amount_cents,
            my_cut_cents: myCut,
            source: entry.source,
            date: entry.created_at,
            role: isRemixer ? 'Remixer' : 'Original Artist',
            pct
          });
        }
      }
    }

    return NextResponse.json({ 
      total_earned_cents: totalEarnedCents,
      transactions: transactions.slice(0, 10) // latest 10
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}