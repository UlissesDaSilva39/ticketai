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

const targetId = "f90b19de-6b3c-41a0-8103-97133dc27917";

(async () => {
  console.log("1a. promoters lookup by id OR user_id = f90b19de-...");
  const { data: p1, error: e1 } = await supabase
    .from("promoters")
    .select("id, user_id, display_name")
    .or("id.eq." + targetId + ",user_id.eq." + targetId)
    .maybeSingle();
  console.log(e1 ? "ERROR: " + e1.message : JSON.stringify(p1));

  console.log("\n1b. All rows in promoters:");
  const { data: all } = await supabase.from("promoters").select("id, user_id, display_name");
  console.log(JSON.stringify(all, null, 2));

  console.log("\n1c. Event organizer for Folk & Whisky:");
  const { data: ev } = await supabase
    .from("events")
    .select("id, title, organizer_id")
    .eq("id", "2a1a8455-e783-468b-8ebd-91210f10a871")
    .maybeSingle();
  console.log(JSON.stringify(ev));
})();