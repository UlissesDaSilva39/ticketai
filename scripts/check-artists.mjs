import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data } = await supabase.from("follows").select("target_type").limit(100);
const types = [...new Set((data || []).map(f => f.target_type))];
console.log("target_type values:", types);
const { data: profiles } = await supabase.from("profiles").select("id, username, role").not("username", "is", null).limit(5);
console.log("Sample profiles:", profiles);
