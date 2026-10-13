import { createServerSupabase } from "@/lib/supabase/server";
import type { City } from "@/lib/cities";

export async function loadCityData(city: City) {
  const supabase = await createServerSupabase();
  const cityName = city.name;

  const { data: venues } = await supabase
    .from("venues")
    .select("id, name, slug, city, hero_image")
    .ilike("city", cityName)
    .limit(48);

  const venueIds = (venues ?? []).map((v) => v.id);

  let events: {
    id: string; title: string; start_date: string; hero_image: string | null;
    venue_id: string | null; status: string | null;
  }[] = [];

  if (venueIds.length > 0) {
    const { data } = await supabase
      .from("events")
      .select("id, title, start_date, hero_image, venue_id, status")
      .in("venue_id", venueIds)
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(24);
    events = data ?? [];
  }

  const { data: artists } = await supabase
    .from("artists")
    .select("id, name, slug, genre, avatar_url, city")
    .ilike("city", cityName)
    .limit(48);

  return {
    venues: venues ?? [],
    events,
    artists: artists ?? [],
  };
}
