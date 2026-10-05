const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
let raw = fs.readFileSync(".env.local", "utf8");
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const env = {};
for (const line of raw.split(/\r?\n/)) {
  const l = line.trim();
  if (!l || l.startsWith("#")) continue;
  const i = l.indexOf("=");
  if (i < 0) continue;
  env[l.slice(0, i)] = l.slice(i + 1);
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const ME = "f90b19de-6b3c-41a0-8103-97133dc27917";

(async () => {
  console.log("=== 1. My accepted friendships ===");
  const { data: fs1, error: e1 } = await supabase
    .from("friendships")
    .select("user_id, friend_id, status")
    .eq("status", "accepted")
    .or("user_id.eq." + ME + ",friend_id.eq." + ME);
  console.log(e1 ? "ERROR: " + e1.message : JSON.stringify(fs1, null, 2));

  console.log("\n=== 2. All event_interest for demo's friends ===");
  const friendIds = (fs1 || []).map((f) => f.user_id === ME ? f.friend_id : f.user_id);
  console.log("friendIds:", friendIds);
  if (friendIds.length > 0) {
    const { data: ei, error: e2 } = await supabase
      .from("event_interest")
      .select("id, user_id, event_id, status, created_at")
      .in("user_id", friendIds);
    console.log(e2 ? "ERROR: " + e2.message : JSON.stringify(ei, null, 2));
  }

  console.log("\n=== 3. My going events ===");
  const { data: myGoing, error: e3 } = await supabase
    .from("event_interest")
    .select("event_id, status")
    .eq("user_id", ME)
    .eq("status", "going");
  console.log(e3 ? "ERROR: " + e3.message : JSON.stringify(myGoing, null, 2));

  console.log("\n=== 4. Everyone going to my events (excluding me) ===");
  const myEventIds = (myGoing || []).map((r) => r.event_id);
  if (myEventIds.length > 0) {
    const { data: others, error: e4 } = await supabase
      .from("event_interest")
      .select("user_id, event_id")
      .in("event_id", myEventIds)
      .eq("status", "going")
      .neq("user_id", ME);
    console.log(e4 ? "ERROR: " + e4.message : JSON.stringify(others, null, 2));
  } else {
    console.log("(no going events for demo)");
  }
})();