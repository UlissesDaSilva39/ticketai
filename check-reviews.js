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

(async () => {
  console.log("=== 1. Plain select (no join) ===");
  const { data: r1, error: e1 } = await supabase
    .from("event_reviews")
    .select("id, rating, comment, user_id, created_at")
    .eq("event_id", "2a1a8455-e783-468b-8ebd-91210f10a871");
  console.log(e1 ? "ERROR: " + e1.message : JSON.stringify(r1, null, 2));

  console.log("");
  console.log("=== 2. Same query with profiles!inner join (what the page uses) ===");
  const { data: r2, error: e2 } = await supabase
    .from("event_reviews")
    .select("id, rating, comment, user_id, created_at, profiles!inner(full_name, username)")
    .eq("event_id", "2a1a8455-e783-468b-8ebd-91210f10a871")
    .order("created_at", { ascending: false });
  console.log(e2 ? "ERROR: " + e2.message : JSON.stringify(r2, null, 2));

  console.log("");
  console.log("=== 3. Try alternative join syntax (no !inner) ===");
  const { data: r3, error: e3 } = await supabase
    .from("event_reviews")
    .select("id, rating, comment, user_id, created_at, profiles(full_name, username)")
    .eq("event_id", "2a1a8455-e783-468b-8ebd-91210f10a871")
    .order("created_at", { ascending: false });
  console.log(e3 ? "ERROR: " + e3.message : JSON.stringify(r3, null, 2));
})();