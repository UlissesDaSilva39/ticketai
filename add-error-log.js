const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// Replace the fetch block to capture and log the error
const oldFetch = `  const { data: reviewsData } = await supabase
    .from("event_reviews")
    .select("id, rating, comment, user_id, created_at, profiles!inner(full_name, username)")
    .eq("event_id", id)
    .order("created_at", { ascending: false });`;

const newFetch = `  const { data: reviewsData, error: reviewsError } = await supabase
    .from("event_reviews")
    .select("id, rating, comment, user_id, created_at, profiles!inner(full_name, username)")
    .eq("event_id", id)
    .order("created_at", { ascending: false });
  if (reviewsError) console.error("[reviews] fetch error:", reviewsError);
  console.log("[reviews] fetched", reviewsData?.length ?? 0, "rows for event", id);`;

if (t.includes(oldFetch)) {
  t = t.replace(oldFetch, newFetch);
  fs.writeFileSync(p, t);
  console.log("Error logging added.");
} else {
  console.log("Fetch block not found — text may have shifted. Showing context:");
  const idx = t.indexOf('from("event_reviews")');
  console.log(JSON.stringify(t.slice(idx - 100, idx + 400)));
}