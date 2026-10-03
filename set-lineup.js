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

const lineup = [
  { name: "The Tannahill Weavers", time: "19:30", photo: "https://picsum.photos/seed/tannahill/600/600", bio: "Legendary Scottish folk band." },
  { name: "Karine Polwart", time: "20:30", photo: "https://picsum.photos/seed/karine/600/600", bio: "Award-winning songwriter from Stirlingshire." },
  { name: "Peatbog Faeries", time: "22:00", photo: "https://picsum.photos/seed/peatbog/600/600", bio: "Skye's finest Celtic fusion." }
];

(async () => {
  const { data, error } = await supabase
    .from("events")
    .update({ lineup })
    .eq("id", "2a1a8455-e783-468b-8ebd-91210f10a871")
    .select("id, lineup");
  if (error) { console.log("ERROR:", error.message); process.exit(1); }
  console.log("Photos updated. Row returned:", JSON.stringify(data));
})();