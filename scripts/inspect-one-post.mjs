import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

const { data } = await supabase.from("posts").select("*").limit(1).single();
console.log("Full post shape:");
console.log(JSON.stringify(data, null, 2));
