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
console.log("Parsed keys:", Object.keys(env));
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing:", { url: !!url, key: !!key }); process.exit(1); }
const supabase = createClient(url, key);
(async () => {
  for (const t of ["profiles", "friendships", "event_interest", "events"]) {
    const { data, error, count } = await supabase.from(t).select("*", { count: "exact" }).limit(10);
    console.log("\n=== " + t + " (" + (count ?? "?") + " rows) ===");
    console.log(error ? "ERROR: " + error.message : JSON.stringify(data, null, 2));
  }
})();