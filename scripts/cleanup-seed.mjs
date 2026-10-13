import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Remove all likes (we only ever seeded these, none existed before)
const { error: likeErr } = await supabase.from("post_likes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
if (likeErr) console.error("likes delete:", likeErr.message);
else console.log("Cleared post_likes");

// Reset like_count on all posts
const { data: posts } = await supabase.from("posts").select("id").limit(500);
for (const p of posts || []) {
  await supabase.from("posts").update({ like_count: 0 }).eq("id", p.id);
}
console.log("Reset like_count on " + (posts?.length || 0) + " posts");

console.log("Done. Note: follows were not removed (they may include real data).");
