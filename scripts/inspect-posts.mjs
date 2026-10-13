import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

// Get latest posts with authors
const { data } = await supabase
  .from("posts")
  .select("id, body, author_id, created_at, like_count, comment_count")
  .order("created_at", { ascending: false })
  .limit(10);

console.log(`Latest 10 posts:`);
for (const p of data || []) {
  console.log(`  ${p.created_at?.slice(0,10)} | likes:${p.like_count} | comments:${p.comment_count} | ${p.body?.slice(0,50)}`);
}

// How old is the newest post?
const newest = data?.[0]?.created_at;
if (newest) {
  const daysAgo = (Date.now() - new Date(newest).getTime()) / 86400000;
  console.log(`\nNewest post: ${newest}`);
  console.log(`Days ago: ${daysAgo.toFixed(1)}`);
}
