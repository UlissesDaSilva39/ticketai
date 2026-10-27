import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placementType = searchParams.get("type") || "music_page";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data, error } = await supabase
    .from("featured_placements")
    .select("id, artist_id, artist_name, placement_type, starts_at, ends_at")
    .gt("ends_at", new Date().toISOString())
    .eq("payment_status", "paid")
    .in("placement_type", [placementType, "both"])
    .order("starts_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ featured: data || [] });
}
