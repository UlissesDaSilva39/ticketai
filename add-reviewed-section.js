const fs = require("fs");
const p = "app/u/[username]/page.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

/* ============================================================
   1. Add query for the user's reviews (right after interestedIds)
   ============================================================ */
if (!t.includes("reviewedIds")) {
  const anchor = `  const interestedIds = (interestRows || [])`;

  // Find the end of the interestedIds declaration line
  const start = t.indexOf(anchor);
  if (start === -1) {
    console.log("1. MISS — interestedIds anchor not found.");
    process.exit(1);
  }
  const lineEnd = t.indexOf("\n", start) + 1;

  const reviewQuery = `
  const { data: reviewRows } = await supabase
    .from("event_reviews")
    .select("event_id, rating, comment, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const reviewedIds = (reviewRows || []).map((r) => r.event_id);
  const reviewMap: Record<string, { rating: number; comment: string | null }> = {};
  for (const r of reviewRows || []) {
    reviewMap[r.event_id] = { rating: r.rating, comment: r.comment };
  }
`;

  t = t.slice(0, lineEnd) + reviewQuery + t.slice(lineEnd);
  console.log("1. Review query added.");
}

/* ============================================================
   2. Expand the events fetch to include reviewed events
   ============================================================ */
if (!t.includes("allIds") || !t.includes("reviewedIds")) {
  // nothing
}
// Find: const allIds = [...goingIds, ...interestedIds];
const oldAllIds = `  const allIds = [...goingIds, ...interestedIds];`;
const newAllIds = `  const allIds = [...new Set([...goingIds, ...interestedIds, ...reviewedIds])];`;

if (t.includes(oldAllIds)) {
  t = t.replace(oldAllIds, newAllIds);
  console.log("2. allIds now includes reviewed events.");
}

/* ============================================================
   3. Render the REVIEWED section between GOING TO and INTERESTED IN
   ============================================================ */
if (!t.includes("REVIEWED")) {
  // Find the start of the INTERESTED IN section
  const interestedAnchor = `      {interestedIds.length > 0 && (`;
  if (!t.includes(interestedAnchor)) {
    console.log("3. MISS — interested section anchor not found.");
    process.exit(1);
  }

  const reviewedSection = `      {reviewedIds.length > 0 && (
        <div className="mb-12">
          <h2
            className="text-4xl font-bold mb-6 uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            REVIEWED
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {events
              .filter((e) => reviewedIds.includes(e.id))
              .map((e) => {
                const rev = reviewMap[e.id];
                return (
                  <div key={e.id} className="relative">
                    <EventCard event={e} />
                    {rev && (
                      <div className="mt-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span key={n} className={n <= rev.rating ? "text-yellow-500" : "text-gray-300"}>
                              {"\\u2605"}
                            </span>
                          ))}
                        </div>
                        {rev.comment && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{rev.comment}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

`;

  t = t.replace(interestedAnchor, reviewedSection + interestedAnchor);
  console.log("3. REVIEWED section added before INTERESTED IN.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}