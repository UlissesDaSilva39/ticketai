import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing env vars"); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession: false } });

const report = { startedAt: new Date().toISOString(), steps: [] };

function log(name, detail) {
  const entry = { step: name, ...detail };
  report.steps.push(entry);
  console.log(JSON.stringify(entry));
}

// ---------- 1. Fetch real auth user IDs ----------
const { data: authList, error: authErr } = await supabase.auth.admin.listUsers({ perPage: 200 });
if (authErr) { console.error("listUsers failed:", authErr.message); process.exit(1); }
const authUserIds = (authList.users || []).map(u => u.id);
console.log("Auth user count:", authUserIds.length);
if (authUserIds.length < 2) { console.error("Need at least 2 auth users to seed likes"); process.exit(1); }

// ---------- 2. Fetch existing post IDs ----------
const { data: posts, error: postErr } = await supabase
  .from("posts")
  .select("id, author_id, like_count")
  .limit(200);
if (postErr) { console.error("posts fetch failed:", postErr.message); process.exit(1); }
console.log("Posts to like:", posts.length);

// ---------- 3. Wipe existing seed likes (idempotency) ----------
// We tag seed likes by using a deterministic pattern; simplest is to delete all and re-insert
// Safe because post_likes is currently 0.
await supabase.from("post_likes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
log("post_likes_cleared", { ok: true });

// ---------- 4. Create ~250 likes across posts ----------
const likeRows = [];
const seen = new Set();
for (const post of posts) {
  // Random 0-8 likes per post
  const n = Math.floor(Math.random() * 9);
  const shuffled = [...authUserIds].sort(() => Math.random() - 0.5);
  for (let i = 0; i < n && i < shuffled.length; i++) {
    const userId = shuffled[i];
    const key = post.id + ":" + userId;
    if (seen.has(key)) continue;
    seen.add(key);
    likeRows.push({ post_id: post.id, user_id: userId });
  }
}
console.log("Prepared like rows:", likeRows.length);

// Insert in chunks of 50 to avoid payload limits
let likesInserted = 0;
let likesFailed = 0;
for (let i = 0; i < likeRows.length; i += 50) {
  const chunk = likeRows.slice(i, i + 50);
  const { error } = await supabase.from("post_likes").insert(chunk);
  if (error) {
    likesFailed += chunk.length;
    console.error("  chunk " + i + " failed:", error.message.slice(0, 120));
  } else {
    likesInserted += chunk.length;
  }
}
log("post_likes_inserted", { inserted: likesInserted, failed: likesFailed, total: likeRows.length });

// ---------- 5. Sync like_count on posts ----------
let countsSynced = 0;
for (const post of posts) {
  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id);
  if (count !== null && count !== post.like_count) {
    await supabase.from("posts").update({ like_count: count }).eq("id", post.id);
    countsSynced++;
  }
}
log("post_like_counts_synced", { synced: countsSynced });

// ---------- 6. Add ~35 follows (follower → artist/promoter/venue/user) ----------
// Fetch a sample of profiles with valid roles and existing auth ids
const { data: profiles } = await supabase
  .from("profiles")
  .select("id, role")
  .in("id", authUserIds)
  .limit(60);

const { data: existingFollows } = await supabase.from("follows").select("follower_id, target_id").limit(500);
const followSet = new Set((existingFollows || []).map(f => f.follower_id + ":" + f.target_id));

const followRows = [];
const validTargets = (profiles || []).filter(p => p.role && ["artist","promoter","venue"].includes(p.role));
for (let i = 0; i < 35 && i < validTargets.length * 3; i++) {
  const follower = profiles[Math.floor(Math.random() * profiles.length)];
  const target = validTargets[Math.floor(Math.random() * validTargets.length)];
  if (!follower || !target || follower.id === target.id) continue;
  const key = follower.id + ":" + target.id;
  if (followSet.has(key)) continue;
  followSet.add(key);
  followRows.push({
    follower_id: follower.id,
    target_type: target.role,
    target_id: target.id,
  });
}
console.log("Prepared follow rows:", followRows.length);

let followsInserted = 0;
for (let i = 0; i < followRows.length; i += 30) {
  const chunk = followRows.slice(i, i + 30);
  const { error } = await supabase.from("follows").insert(chunk);
  if (!error) followsInserted += chunk.length;
  else console.error("  follows chunk failed:", error.message.slice(0, 120));
}
log("follows_inserted", { inserted: followsInserted });

// ---------- 7. Final counts ----------
const final = {};
for (const t of ["post_likes","follows"]) {
  const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
  final[t] = count;
}
report.finalCounts = final;
report.finishedAt = new Date().toISOString();
writeFileSync("seed-report.json", JSON.stringify(report, null, 2));
console.log("");
console.log("=== FINAL ===");
console.log(JSON.stringify(final, null, 2));
