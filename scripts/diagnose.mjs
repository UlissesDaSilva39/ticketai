import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error("Missing env vars"); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession: false } });

const out = {};

out.rowCounts = {};
for (const t of ["profiles","posts","post_comments","post_likes","follows","events","venues"]) {
  const r = await supabase.from(t).select("*", { count: "exact", head: true });
  out.rowCounts[t] = r.error ? ("ERR " + r.error.message) : r.count;
}

try {
  const r = await supabase.from("posts").select("id, body, author_id, created_at, like_count, comment_count").order("created_at", { ascending: false }).limit(10);
  out.latestPosts = (r.data || []).map(p => ({ date: p.created_at ? p.created_at.slice(0, 10) : null, likes: p.like_count, comments: p.comment_count, body: p.body ? p.body.slice(0, 60) : null }));
  if (r.data && r.data[0] && r.data[0].created_at) out.newestPostAgeDays = ((Date.now() - new Date(r.data[0].created_at).getTime()) / 86400000).toFixed(1);
} catch (e) { out.latestPostsError = e.message; }

try {
  const post = (await supabase.from("posts").select("id").limit(1).single()).data;
  const prof = (await supabase.from("profiles").select("id").limit(1).single()).data;
  if (post && prof) {
    const candidates = [
      { post_id: post.id, user_id: prof.id },
      { post_id: post.id, author_id: prof.id },
      { post_id: post.id, profile_id: prof.id },
      { post_id: post.id, liker_id: prof.id },
    ];
    out.postLikeProbe = [];
    for (const p of candidates) {
      const r = await supabase.from("post_likes").insert(p);
      if (r.error) { out.postLikeProbe.push(Object.keys(p).slice(1).join(",") + " => " + r.error.message.slice(0, 80)); }
      else { out.postLikeProbe.push(Object.keys(p).slice(1).join(",") + " => OK"); await supabase.from("post_likes").delete().match(p); break; }
    }
  }
} catch (e) { out.postLikeProbeError = e.message; }

try {
  const d = (await supabase.from("posts").select("*").limit(1).single()).data;
  if (d) out.samplePostKeys = Object.keys(d);
} catch (e) { out.samplePostKeysError = e.message; }

try {
  const d = (await supabase.from("follows").select("*").limit(3)).data;
  out.followsSample = d;
} catch (e) { out.followsSampleError = e.message; }

try {
  const d = (await supabase.from("posts").select("author_type").limit(200)).data;
  const set = new Set();
  for (const p of (d || [])) if (p.author_type) set.add(p.author_type);
  out.authorTypes = [...set];
} catch (e) {}

writeFileSync("diagnose-output.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
