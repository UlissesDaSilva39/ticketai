import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const username = "alexmorgan";
const { data, error } = await supabase
  .from("profiles")
  .select("id, username, full_name")
  .or("username.eq." + username + ",id.eq." + username)
  .maybeSingle();

console.log("Query result:", data);
console.log("Query error:", error?.message || "none");
console.log("");
console.log("If data is null and error is none, the .or() filter isn't matching.");
