import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data } = await supabase.from("events").select("*").limit(1).maybeSingle();
if (data) {
  console.log("Event keys:", Object.keys(data).join(", "));
  console.log("");
  console.log("Sample event:");
  console.log(JSON.stringify({
    id: data.id,
    title: data.title,
    start_date: data.start_date,
    end_date: data.end_date,
    event_type: data.event_type,
    status: data.status,
    hero_image: data.hero_image,
    description: data.description?.slice(0, 100),
    venue_id: data.venue_id,
    organizer_id: data.organizer_id,
    ticket_types: data.ticket_types,
    lineup: data.lineup,
    views: data.views,
  }, null, 2));
}

// Venue shape
const { data: venue } = await supabase.from("venues").select("*").limit(1).maybeSingle();
if (venue) {
  console.log("");
  console.log("Venue keys:", Object.keys(venue).join(", "));
}

// Event with venue join
const { data: joined, error } = await supabase
  .from("events")
  .select("id, title, venue_id, venues(id, name, city, slug)")
  .limit(1)
  .maybeSingle();
console.log("");
console.log("Join test:", joined);
console.log("Join error:", error?.message || "none");
