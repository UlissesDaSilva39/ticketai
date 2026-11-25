import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/licensing/mine: the signed-in member's licences (bought and issued)
// and their own listings. RLS limits every query to their own rows.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const [dealsRes, listingsRes] = await Promise.all([
    supabase
      .from("licence_deals")
      .select("id, listing_id, buyer_id, licence_type, project_title, amount_pence, total_pence, status, created_at")
      .neq("status", "cancelled")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("licence_listings")
      .select("id, track_title, artist_name, status, deals_count, price_creator, price_commercial, price_sync")
      .eq("owner_id", user.id)
      .neq("status", "deleted")
      .order("created_at", { ascending: false }),
  ]);
  if (dealsRes.error || listingsRes.error) return NextResponse.json({ bought: [], sold: [], listings: [], setupPending: true });

  const deals = dealsRes.data ?? [];
  const ids = [...new Set(deals.map((d) => d.listing_id))];
  const { data: tracks } = ids.length
    ? await supabase.from("licence_listings").select("id, track_title, artist_name").in("id", ids)
    : { data: [] as { id: string; track_title: string; artist_name: string }[] };
  const byId = new Map((tracks ?? []).map((t) => [t.id, t]));

  const shape = (d: (typeof deals)[number]) => ({
    id: d.id,
    listingId: d.listing_id,
    trackTitle: byId.get(d.listing_id)?.track_title ?? "Track",
    artistName: byId.get(d.listing_id)?.artist_name ?? "",
    licenceType: d.licence_type,
    projectTitle: d.project_title,
    amountPence: d.amount_pence,
    totalPence: d.total_pence,
    status: d.status,
    createdAt: d.created_at,
  });

  const sold = deals.filter((d) => d.buyer_id !== user.id);
  return NextResponse.json({
    bought: deals.filter((d) => d.buyer_id === user.id).map(shape),
    sold: sold.map(shape),
    earnedPence: sold.filter((d) => d.status === "active").reduce((s, d) => s + d.amount_pence, 0),
    listings: (listingsRes.data ?? []).map((l) => ({
      id: l.id,
      trackTitle: l.track_title,
      artistName: l.artist_name,
      status: l.status,
      dealsCount: l.deals_count,
      prices: { creator: l.price_creator, commercial: l.price_commercial, sync: l.price_sync },
    })),
  });
}
