import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ subscriptions: [] }, { status: 401 });

  const { data, error } = await supabase
    .from("user_memberships")
    .select(`
      id, entity_type, entity_id, status, started_at,
      tier:club_tiers(name, price_monthly)
    `)
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("started_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ subscriptions: data || [] });
}