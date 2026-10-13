import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Events don't have a city column directly — check via venue
const { data: venues } = await sb.from("venues").select("id, city, slug, name");
const { data: events } = await sb.from("events").select("id, venue_id, status");

const cityCounts = {};
for (const v of venues ?? []) {
  if (!v.city) continue;
  const key = v.city.trim();
  if (!cityCounts[key]) cityCounts[key] = { venues: 0, events: 0 };
  cityCounts[key].venues++;
}
const venueCity = {};
for (const v of venues ?? []) venueCity[v.id] = v.city;
for (const e of events ?? []) {
  const c = venueCity[e.venue_id];
  if (c) {
    if (!cityCounts[c]) cityCounts[c] = { venues: 0, events: 0 };
    cityCounts[c].events++;
  }
}

const sorted = Object.entries(cityCounts).sort((a, b) => b[1].events - a[1].events);
for (const [city, { venues, events }] of sorted.slice(0, 30)) {
  console.log("  " + city.padEnd(20) + " venues=" + venues + " events=" + events);
}
console.log("  Total cities: " + sorted.length);
