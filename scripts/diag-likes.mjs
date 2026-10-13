import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

console.log("=== DB DIAGNOSTIC ===");

const { data: list } = await supabase.auth.admin.listUsers({ perPage: 200 });
console.log("Total auth users:", list.users.length);

const play = list.users.find((u) => u.email === "playwright@ticketai.test");
if (!play) {
  console.log("Playwright user NOT FOUND");
  process.exit(0);
}
console.log("Playwright user id:", play.id);

const { data: post } = await supabase
  .from("posts")
  .select("id")
  .limit(1)
  .maybeSingle();

if (!post) {
  console.log("No posts in DB");
  process.exit(0);
}
console.log("Test post id:", post.id);

const { error } = await supabase
  .from("post_likes")
  .insert({ post_id: post.id, user_id: play.id });

console.log("Insert result:", error ? error.message : "OK - works");

if (!error) {
  await supabase
    .from("post_likes")
    .delete()
    .match({ post_id: post.id, user_id: play.id });
  console.log("Cleaned up");
}

const { count: lc } = await supabase
  .from("post_likes")
  .select("*", { count: "exact", head: true });
console.log("Total post_likes:", lc);

const { count: pc } = await supabase
  .from("posts")
  .select("*", { count: "exact", head: true });
console.log("Total posts:", pc);
