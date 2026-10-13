import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

// Current data counts
const tables = ["profiles","posts","post_comments","post_likes","follows","events","venues"];
for (const t of tables) {
  const { count, error } = await supabase.from(t).select("*", { count: "exact", head: true });
  console.log(`${t}: ${error ? "ERR " + error.message : count}`);
}

console.log("\n--- Sample profile ---");
const { data: sampleProfile } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
if (sampleProfile) {
  console.log(JSON.stringify({
    id: sampleProfile.id,
    username: sampleProfile.username,
    role: sampleProfile.role,
    city: sampleProfile.city,
    genre: sampleProfile.genre,
    full_name: sampleProfile.full_name,
  }, null, 2));
}

console.log("\n--- Sample event ---");
const { data: sampleEvent } = await supabase.from("events").select("*").limit(1).maybeSingle();
if (sampleEvent) {
  console.log("Keys:", Object.keys(sampleEvent).join(", "));
  console.log("ticket_types sample:", JSON.stringify(sampleEvent.ticket_types).slice(0, 200));
  console.log("status:", sampleEvent.status);
  console.log("event_type:", sampleEvent.event_type);
}

console.log("\n--- Distinct event status/type ---");
const { data: statuses } = await supabase.from("events").select("status, event_type").limit(200);
const statusSet = [...new Set((statuses || []).map(e => e.status).filter(Boolean))];
const typeSet = [...new Set((statuses || []).map(e => e.event_type).filter(Boolean))];
console.log("statuses:", statusSet.join(", "));
console.log("event_types:", typeSet.join(", "));

console.log("\n--- Distinct author_type in posts ---");
const { data: postAuthors } = await supabase.from("posts").select("author_type").limit(200);
console.log("author_types:", [...new Set((postAuthors || []).map(p => p.author_type).filter(Boolean))].join(", "));

console.log("\n--- Distinct target_type in follows ---");
const { data: followTypes } = await supabase.from("follows").select("target_type").limit(200);
console.log("target_types:", [...new Set((followTypes || []).map(f => f.target_type).filter(Boolean))].join(", "));
