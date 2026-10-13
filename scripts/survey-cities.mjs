import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Venues by city
const { data: venues } = await supabase.from("venues").select("id, name, city, country, hero_image").not("city", "is", null);
const cityCounts = {};
for (const v of venues || []) {
  if (!v.city) continue;
  cityCounts[v.city] = (cityCounts[v.city] || 0) + 1;
}
console.log("Venues by city:", cityCounts);

// Events: what does venue_id link to?
const { data: events } = await supabase.from("events").select("id, title, venue_id, start_date, status").limit(5);
console.log("Sample events:", JSON.stringify(events, null, 2));

// Distinct cities across venues
const cities = [...new Set((venues || []).map(v => v.city).filter(Boolean))];
console.log("Distinct cities:", cities.sort());
