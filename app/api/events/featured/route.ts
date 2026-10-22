import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("featured_events_view")
      .select("*")
      .not("featured_until", "is", null)
      .gte("featured_until", new Date().toISOString())
      .order("featured_until", { ascending: false })
      .limit(6);

    if (error) return NextResponse.json({ events: [] });

    const events = (data || []).map((e: any) => {
      const tickets = Array.isArray(e.ticket_types) ? e.ticket_types : [];
      const first = tickets[0];
      const d = e.start_date ? new Date(e.start_date) : null;
      return {
        id: e.id,
        title: e.title,
        date: d ? d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "",
        time: d ? d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "",
        venue: e.venue_name ?? "",
        venueSlug: e.venue_slug ?? "",
        city: e.venue_city ?? "",
        price: first ? Number(first.price) : 0,
        banner: e.hero_image ?? "",
        verified: true,
        friendsGoing: 0,
        urgent: "",
        artists: Array.isArray(e.artists) ? e.artists : [],
        promoter: e.promoter_slug ? { slug: e.promoter_slug, name: e.promoter_name || e.promoter_slug } : null,
        membershipUrl: e.membership_url || e.venue_membership_url || null,
        ageRestriction: e.age_restriction ?? null,
        featured: true,
      };
    });

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}