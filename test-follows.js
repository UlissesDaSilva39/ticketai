const fs = require("fs");
const http = require("http");
const { createClient } = require("@supabase/supabase-js");

// Load env
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

const TARGET_ID = "f90b19de-6b3c-41a0-8103-97133dc27917";

(async () => {
  console.log("=== 1. Count followers BEFORE ===");
  const { count: before } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", "promoter")
    .eq("target_id", "35e5d98b-e4f9-4cfc-8701-97887227b738");
  console.log("Follower count (by promoters.id):", before ?? 0);

  console.log("\n=== 2. POST to /api/follows/toggle (no cookies) ===");
  const body = JSON.stringify({ targetType: "promoter", targetId: TARGET_ID });
  await new Promise((resolve) => {
    const req = http.request({
      hostname: "localhost",
      port: 3000,
      path: "/api/follows/toggle",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log("Status:", res.statusCode);
        console.log("Body:", data);
        resolve();
      });
    });
    req.on("error", (e) => {
      console.log("ERROR:", e.message);
      resolve();
    });
    req.write(body);
    req.end();
  });

  console.log("\n=== 3. All follow rows for this promoter ===");
  const { data: rows } = await supabase
    .from("follows")
    .select("id, follower_id, target_type, target_id, created_at")
    .eq("target_type", "promoter");
  console.log(JSON.stringify(rows, null, 2));
})();