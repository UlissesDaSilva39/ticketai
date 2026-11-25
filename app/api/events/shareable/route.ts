import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Upcoming published events a member can attach to a post. ?q= searches title/venue/city.
export async function GET(req: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ events: [] }, { status: 401 });

  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 60).replace(/[%,()]/g, " ");
  let query = supabase
    .from("events")
    .select("id, title, start_date, venue_name, venue_city, hero_image")
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(8);
  if (q) query = query.or(`title.ilike.%${q}%,venue_name.ilike.%${q}%,venue_city.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ events: [], error: "Could not load events" }, { status: 500 });
  return NextResponse.json({ events: data ?? [] });
}
