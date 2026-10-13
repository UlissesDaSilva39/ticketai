import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data, error } = await sb.from("comments").select("*").limit(1);
if (error) {
  console.log("  ❌ comments table: " + error.message);
} else if (!data?.length) {
  console.log("  ✅ comments table exists (empty)");
} else {
  console.log("  ✅ comments columns: " + Object.keys(data[0]).join(", "));
}

// Also check post_likes for the pattern
const { data: pl, error: ple } = await sb.from("post_likes").select("*").limit(1);
if (ple) console.log("  ⚠️  post_likes: " + ple.message);
else if (pl?.length) console.log("  ✅ post_likes columns: " + Object.keys(pl[0]).join(", "));
