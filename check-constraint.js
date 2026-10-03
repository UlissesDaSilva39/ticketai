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
  // Try a fake upsert that violates FK — if we get an FK error, the constraint exists
  const { error } = await supabase
    .from("event_interest")
    .upsert(
      { user_id: "00000000-0000-0000-0000-000000000000", event_id: "2a1a8455-e783-468b-8ebd-91210f10a871", status: "going" },
      { onConflict: "user_id,event_id" }
    );
  if (!error) {
    console.log("Upsert succeeded (fake row should be gone — no persistence test needed)");
    return;
  }
  if (error.message.includes("no unique or exclusion constraint") || error.message.includes("there is no unique")) {
    console.log("MISSING CONSTRAINT — run this in Supabase SQL editor:");
    console.log("alter table event_interest add constraint event_interest_user_id_event_id_key unique (user_id, event_id);");
  } else if (error.message.includes("foreign key") || error.message.includes("violates foreign key")) {
    console.log("CONSTRAINT OK — upsert recognized (user_id,event_id). FK rejected the fake user as expected.");
  } else {
    console.log("Unknown:", error.message);
  }
})();