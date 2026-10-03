const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// 4a — import
if (!t.includes('ReviewsSection from')) {
  const imp = 'import InterestButtons from "@/components/InterestButtons";';
  if (t.includes(imp)) {
    t = t.replace(imp, imp + '\nimport ReviewsSection from "@/components/ReviewsSection";');
    console.log("Import added.");
  }
}

// 4b — fetch reviews after the friendsGoing block
if (!t.includes("event_reviews")) {
  const anchor = "let friendsGoing: Array<{ id: string; full_name: string | null; username: string | null }> = [];";
  if (t.includes(anchor)) {
    // find the closing of the outer if block for friendsGoing
    const start = t.indexOf(anchor);
    // Look for the pattern "  }\n\n  return (" after start — that's the end of the fetch section
    const returnIdx = t.indexOf("\n  return (", start);
    if (returnIdx > 0) {
      const fetch = `
  const { data: reviewsData } = await supabase
    .from("event_reviews")
    .select("id, rating, comment, user_id, created_at, profiles!inner(full_name, username)")
    .eq("event_id", id)
    .order("created_at", { ascending: false });

  const reviews = (reviewsData || []).map((r: { id: string; rating: number; comment: string | null; user_id: string; created_at: string; profiles: { full_name: string | null; username: string | null } | { full_name: string | null; username: string | null }[] }) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    user_id: r.user_id,
    created_at: r.created_at,
    profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles,
  }));

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : null;
  const canReview = !!user && !!myInterest;
`;
      t = t.slice(0, returnIdx) + fetch + t.slice(returnIdx);
      console.log("Fetch inserted.");
    } else {
      console.log("Could not find return( after friendsGoing.");
    }
  } else {
    console.log("friendsGoing anchor not found.");
  }
}

// 4c — render ReviewsSection before GOOD TO KNOW
if (!t.includes("<ReviewsSection")) {
  const pattern = /(\s+)(<div className="mb-12">\s*<h2[^>]*>\s*GOOD TO KNOW)/;
  const m = t.match(pattern);
  if (m) {
    const insertion = `${m[1]}<ReviewsSection\n            eventId={e.id}\n            initialReviews={reviews}\n            currentUserId={user?.id ?? null}\n            canReview={canReview}\n          />\n${m[1]}${m[2]}`;
    t = t.replace(m[0], insertion);
    console.log("Render inserted.");
  } else {
    console.log("GOOD TO KNOW anchor missed for render.");
  }
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved. Changes:", t.length - before.length, "chars added.");
} else {
  console.log("No changes made.");
}

// Verify
const final = fs.readFileSync(p, "utf8");
console.log("Import:", final.includes("ReviewsSection from") ? "yes" : "no");
console.log("Fetch:", final.includes("event_reviews") ? "yes" : "no");
console.log("Render:", final.includes("<ReviewsSection") ? "yes" : "no");