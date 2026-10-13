import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data, error: rpcErr } = await supabase.rpc("exec_sql", {
  sql: "SELECT column_name FROM information_schema.columns WHERE table_name = 'post_likes' ORDER BY ordinal_position;"
});
if (rpcErr) {
  console.log("No exec_sql RPC. Error:", rpcErr.message);
  console.log("Falling back: seed will skip post_likes.");
} else {
  console.log("post_likes columns:", data.map(r => r.column_name).join(", "));
}
