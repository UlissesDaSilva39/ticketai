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

const BOB = "e7b2764c-e18e-41fa-8c6e-a9958e4d254a";
const EVENT = "2a1a8455-e783-468b-8ebd-91210f10a871";

(async () => {
  const { data: f } = await supabase
    .from("friendships")
    .select("user_id, friend_id, status")
    .eq("status", "accepted")
    .or("user_id.eq." + BOB + ",friend_id.eq." + BOB);
  console.log("=== Bob accepted friendships ===");
  console.log(JSON.stringify(f, null, 2));

  const { data: ei } = await supabase
    .from("event_interest")
    .select("user_id, status")
    .eq("event_id", EVENT);
  console.log("\n=== Everyone going on this event ===");
  console.log(JSON.stringify(ei, null, 2));

  const friendIds = (f || []).map((r) => r.user_id === BOB ? r.friend_id : r.user_id);
  const goingIds = (ei || []).filter((r) => r.status === "going").map((r) => r.user_id);
  const intersect = goingIds.filter((id) => friendIds.includes(id));
  console.log("\n=== Friends who are going (the intersection) ===");
  console.log(JSON.stringify(intersect, null, 2));

  if (intersect.length > 0) {
    const { data: p } = await supabase
      .from("profiles")
      .select("id, full_name, username")
      .in("id", intersect);
    console.log("\n=== Their profiles ===");
    console.log(JSON.stringify(p, null, 2));
  }
})();