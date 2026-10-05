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
  const { data: fs1 } = await supabase
    .from("friendships")
    .select("user_id, friend_id, status")
    .eq("status", "accepted")
    .or("user_id.eq." + ME + ",friend_id.eq." + ME);
  console.log(JSON.stringify(fs1, null, 2));

  console.log("\n=== 2. Event interest rows from my friends ===");
  const friendIds = (fs1 || []).map((f) => f.user_id === ME ? f.friend_id : f.user_id);
  console.log("Friend IDs:", friendIds);
  if (friendIds.length > 0) {
    const { data: ei } = await supabase
      .from("event_interest")
      .select("id, user_id, event_id, status, created_at")
      .in("user_id", friendIds);
    console.log(JSON.stringify(ei, null, 2));
  }

  console.log("\n=== 3. My going events ===");
  const { data: myGoing } = await supabase
    .from("event_interest")
    .select("event_id, status")
    .eq("user_id", ME)
    .eq("status", "going");
  console.log(JSON.stringify(myGoing, null, 2));

  console.log("\n=== 4. Others going to same events ===");
  const myEventIds = (myGoing || []).map((r) => r.event_id);
  if (myEventIds.length > 0) {
    const { data: others } = await supabase
      .from("event_interest")
      .select("user_id, event_id, status")
      .in("event_id", myEventIds)
      .eq("status", "going")
      .neq("user_id", ME);
    console.log(JSON.stringify(others, null, 2));
  } else {
    console.log("(no going events)");
  }

  console.log("\n=== 5. My follows ===");
  const { data: fw } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", ME);
  console.log(JSON.stringify(fw, null, 2));
})();