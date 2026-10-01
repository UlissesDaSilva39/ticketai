import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json();
    const {
      name, description, venue_type, address_line1, address_line2,
      city, county, postcode, country, latitude, longitude,
      capacity, standing_capacity, seated_capacity,
      hero_image, status, revenue_share_percent,
    } = body;

    if (!name) return NextResponse.json({ error: "Venue name required" }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const { data, error } = await supabase
      .from("venues")
      .insert({
        organizer_id: user.id,
        name,
        slug,
        description: description || null,
        venue_type: venue_type || null,
        address_line1: address_line1 || null,
        address_line2: address_line2 || null,
        city: city || null,
        county: county || null,
        postcode: postcode || null,
        country: country || "United Kingdom",
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        capacity: capacity ? Number(capacity) : null,
        standing_capacity: standing_capacity ? Number(standing_capacity) : null,
        seated_capacity: seated_capacity ? Number(seated_capacity) : null,
        hero_image: hero_image || null,
        status: status || "draft",
        revenue_share_percent: revenue_share_percent ? Number(revenue_share_percent) : 15,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ venue: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

