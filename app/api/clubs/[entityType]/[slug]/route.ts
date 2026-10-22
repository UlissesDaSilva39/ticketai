import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ entityType: string; slug: string }> }
) {
  const { entityType, slug } = await params;
  const supabase = await createServerSupabase();

  // Fetch tiers for this entity
  const { data: tiers } = await supabase
    .from("club_tiers")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", slug)
    .order("sort_order", { ascending: true });

  // Fetch member count (social proof)
  const { count } = await supabase
    .from("user_memberships")
    .select("*", { count: "exact", head: true })
    .eq("entity_type", entityType)
    .eq("entity_id", slug)
    .eq("status", "active");

  return NextResponse.json({ 
    entityType, 
    slug, 
    tiers: tiers || [], 
    memberCount: count || 0 
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ entityType: string; slug: string }> }
) {
  const { entityType, slug } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json();
  const tierId = body.tierId;
  if (!tierId) return NextResponse.json({ error: "Missing tierId" }, { status: 400 });

  // Create membership
  const { data: membership, error } = await supabase
    .from("user_memberships")
    .upsert({
      user_id: user.id,
      entity_type: entityType,
      entity_id: slug,
      tier_id: tierId,
      status: "active",
    }, { onConflict: "user_id,entity_type,entity_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ membership });
}