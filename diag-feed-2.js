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
  console.log("=== 1. All my friendships ===");
  const { data: fs1 } = await supabase
    .from("friendships")
    .select("user_id, friend_id, status")
    .or("user_id.eq." + ME + ",friend_id.eq." + ME);
  console.log(JSON.stringify(fs1, null, 2));

  console.log("\n=== 2. All event_interest rows from my accepted friends ===");
  const friendIds = (fs1 || [])
    .filter((f) => f.status === "accepted")
    .map((f) => f.user_id === ME ? f.friend_id : f.user_id);
  console.log("Accepted friend IDs:", friendIds);
  if (friendIds.length > 0) {
    const { data: ei } = await supabase
      .from("event_interest")
      .select("user_id, event_id, status, created_at")
      .in("user_id", friendIds)
      .order("created_at", { ascending: false });
    console.log(JSON.stringify(ei, null, 2));
  }

  console.log("\n=== 3. All event_interest rows in the system ===");
  const { data: all } = await supabase
    .from("event_interest")
    .select("user_id, event_id, status")
    .limit(50);
  console.log(JSON.stringify(all, null, 2));

  console.log("\n=== 4. All accepted friendships in the system ===");
  const { data: allFs } = await supabase
    .from("friendships")
    .select("user_id, friend_id, status")
    .eq("status", "accepted");
  console.log(JSON.stringify(allFs, null, 2));
})();