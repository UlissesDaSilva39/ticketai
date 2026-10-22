import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const city = url.searchParams.get("city");
    const sort = url.searchParams.get("sort") || "popular";
    const q = url.searchParams.get("q");

    const supabase = await createServerSupabase();

    let query = supabase
      .from("events")
      .select(`
        id, title, start_date, hero_image, membership_url, age_restriction, ticket_types,
        venue:venues(id, slug, name, city, membership_url),
        promoter:profiles!promoter_id(username, full_name)
      `)
      .eq("status", "published")
      .gte("start_date", new Date().toISOString());

    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    query = sort === "date" ? query.order("start_date", { ascending: true }) : query.order("created_at", { ascending: false });
    query = query.limit(50);

    const { data, error } = await query;
    if (error) return NextResponse.json({ events: [] });

    const ids = (data || []).map((e: any) => e.id);
    const artistMap: Record<string, any[]> = {};
    if (ids.length > 0) {
      const { data: ea } = await supabase
        .from("event_artists")
        .select("event_id, billing_order, artist:artists(slug, name, verified)")
        .in("event_id", ids)
        .order("billing_order", { ascending: true });
      (ea || []).forEach((x: any) => {
        if (!artistMap[x.event_id]) artistMap[x.event_id] = [];
        if (x.artist) artistMap[x.event_id].push(x.artist);
      });
    }

    let events = (data || []).map((e: any) => {
      const tickets = Array.isArray(e.ticket_types) ? e.ticket_types : [];
      const first = tickets[0];
      const d = e.start_date ? new Date(e.start_date) : null;
      return {
        id: e.id,
        title: e.title,
        date: d ? d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "",
        time: d ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "",
        venue: e.venue?.name ?? "",
        venueSlug: e.venue?.slug ?? "",
        city: e.venue?.city ?? "",
        price: first ? Number(first.price) : 0,
        banner: e.hero_image ?? "",
        verified: true,
        friendsGoing: 0,
        urgent: "",
        artists: artistMap[e.id] || [],
        promoter: e.promoter ? { slug: e.promoter.username, name: e.promoter.full_name || e.promoter.username } : null,
        membershipUrl: e.membership_url || e.venue?.membership_url || null,
        ageRestriction: e.age_restriction ?? null,
      };
    });

    if (city) events = events.filter((e: any) => e.city?.toLowerCase() === city.toLowerCase());

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}