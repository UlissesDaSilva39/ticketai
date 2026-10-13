import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

// Try each candidate column name with a no-op insert
const post = await supabase.from("posts").select("id").limit(1).single();
const profile = await supabase.from("profiles").select("id").limit(1).single();
if (!post.data || !profile.data) { console.log("no post/profile"); process.exit(1); }

const postId = post.data.id;
const userId = profile.data.id;

const probes = [
  { post_id: postId, user_id: userId },
  { post_id: postId, author_id: userId },
  { post_id: postId, profile_id: userId },
  { post_id: postId, liker_id: userId },
];

for (const p of probes) {
  const { error } = await supabase.from("post_likes").insert(p);
  if (error) {
    console.log(`[${Object.keys(p).slice(1).join(",")}] → ${error.message.slice(0, 100)}`);
  } else {
    console.log(`✅ [${Object.keys(p).slice(1).join(",")}] SUCCESS`);
    await supabase.from("post_likes").delete().match(p);
    break;
  }
}
