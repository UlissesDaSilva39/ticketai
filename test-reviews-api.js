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

const EVENT = "2a1a8455-e783-468b-8ebd-91210f10a871";
const ALICE = "76d8b2a7-48d8-4676-8f0f-71128337cf94";

(async () => {
  console.log("=== A. Clean slate: delete any existing Alice review ===");
  const { error: delErr } = await supabase
    .from("event_reviews")
    .delete()
    .eq("event_id", EVENT)
    .eq("user_id", ALICE);
  console.log(delErr ? "ERROR: " + delErr.message : "Deleted (or none existed).");

  console.log("\n=== B. Insert a fresh review (upsert) ===");
  const { data: ins, error: insErr } = await supabase
    .from("event_reviews")
    .upsert(
      { event_id: EVENT, user_id: ALICE, rating: 4, comment: "first insert" },
      { onConflict: "event_id,user_id" }
    )
    .select()
    .single();
  console.log(insErr ? "ERROR: " + insErr.message : JSON.stringify(ins, null, 2));

  console.log("\n=== C. Upsert again with different values (simulates Update) ===");
  const { data: upd, error: updErr } = await supabase
    .from("event_reviews")
    .upsert(
      { event_id: EVENT, user_id: ALICE, rating: 5, comment: "updated", updated_at: new Date().toISOString() },
      { onConflict: "event_id,user_id" }
    )
    .select()
    .single();
  console.log(updErr ? "ERROR: " + updErr.message : JSON.stringify(upd, null, 2));

  console.log("\n=== D. Read back: how many rows exist for Alice? ===");
  const { data: rows, error: readErr } = await supabase
    .from("event_reviews")
    .select("id, rating, comment")
    .eq("event_id", EVENT)
    .eq("user_id", ALICE);
  console.log(readErr ? "ERROR: " + readErr.message : JSON.stringify(rows, null, 2));

  console.log("\n=== E. Delete the review ===");
  const { error: del2Err } = await supabase
    .from("event_reviews")
    .delete()
    .eq("event_id", EVENT)
    .eq("user_id", ALICE);
  console.log(del2Err ? "ERROR: " + del2Err.message : "Deleted.");

  console.log("\n=== F. Verify deletion ===");
  const { data: remaining, error: remErr } = await supabase
    .from("event_reviews")
    .select("id")
    .eq("event_id", EVENT)
    .eq("user_id", ALICE);
  console.log(remErr ? "ERROR: " + remErr.message : "Rows remaining: " + (remaining?.length ?? "?"));
})();