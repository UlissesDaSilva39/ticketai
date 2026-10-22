import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("venue_club_view")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ club: null }, { status: 404 });
  }

  return NextResponse.json({ club: data });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json();
  const tierSlug = body.tierSlug;
  if (!tierSlug) return NextResponse.json({ error: "Missing tierSlug" }, { status: 400 });

  const { data: venue } = await supabase
    .from("venues")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!venue) return NextResponse.json({ error: "Venue not found" }, { status: 404 });

  const { data: tier } = await supabase
    .from("venue_membership_tiers")
    .select("id, price_monthly")
    .eq("venue_id", venue.id)
    .eq("slug", tierSlug)
    .maybeSingle();
  if (!tier) return NextResponse.json({ error: "Tier not found" }, { status: 404 });

  const { data: membership, error: insertErr } = await supabase
    .from("venue_memberships")
    .upsert({
      user_id: user.id,
      venue_id: venue.id,
      tier_id: tier.id,
      status: "active",
    }, { onConflict: "user_id,venue_id" })
    .select()
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

  return NextResponse.json({ membership });
}