import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data: venues } = await sb.from("venues").select("slug, name").limit(5);
console.log("=== Venues (first 5) ===");
venues?.forEach((v) => console.log("  /venue/" + v.slug + "  (" + v.name + ")"));

const { data: artists } = await sb.from("artists").select("slug, name").limit(5);
console.log("=== Artists (first 5) ===");
artists?.forEach((a) => console.log("  /artist/" + a.slug + "  (" + a.name + ")"));
