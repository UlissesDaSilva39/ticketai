import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

  // Member count (social proof). Row Level Security only lets users see their
  // own memberships, so count with the server key; only the number is returned.
  const { count } = await createAdminClient()
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

// Joining a club goes through ./checkout (Stripe). There is deliberately no
// POST here: it used to let any signed-in user activate a paid membership for free.
