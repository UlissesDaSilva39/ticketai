const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// 1. Wrap About This Event heading + description
const aboutOld = `            <h2
              className="text-3xl font-bold mb-4 uppercase"
              style={{
                fontFamily: "var(--font-antonio)",
              }}
            >
              About This Event
            </h2>

            <p className="text-gray-700 leading-relaxed">
              {e.description || "No description yet."}
            </p>`;

const aboutNew = `            {activeTab === "about" && (
              <>
                <h2
                  className="text-3xl font-bold mb-4 uppercase"
                  style={{
                    fontFamily: "var(--font-antonio)",
                  }}
                >
                  About This Event
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  {e.description || "No description yet."}
                </p>
              </>
            )}`;

if (t.includes(aboutOld)) {
  t = t.replace(aboutOld, aboutNew);
  console.log("About section wrapped.");
} else {
  console.log("About anchor miss — checking variant.");
  // Fallback: less-strict match
  const aboutRegex = /\s*<h2\s+className="text-3xl font-bold mb-4 uppercase"\s+style=\{\{\s*fontFamily:\s*"var\(--font-antonio\)",?\s*\}\}\s*>\s*About This Event\s*<\/h2>\s*<p className="text-gray-700 leading-relaxed">\s*\{e\.description \|\| "No description yet\."\}\s*<\/p>/;
  if (aboutRegex.test(t)) {
    t = t.replace(aboutRegex, aboutNew);
    console.log("About wrapped (regex).");
  }
}

// 2. Wrap LINEUP — already conditionally rendered, add activeTab
const lineupOld = `          {Array.isArray(e.lineup) && e.lineup.length > 0 && (`;
const lineupNew = `          {activeTab === "lineup" && Array.isArray(e.lineup) && e.lineup.length > 0 && (`;

if (t.includes(lineupOld)) {
  t = t.replace(lineupOld, lineupNew);
  console.log("LINEUP wrapped.");
}

// 3. Wrap ReviewsSection
const reviewsOld = `          <ReviewsSection
            eventId={e.id}
            initialReviews={reviews}
            currentUserId={user?.id ?? null}
            canReview={canReview}
          />`;

const reviewsNew = `          {activeTab === "reviews" && (
            <ReviewsSection
              eventId={e.id}
              initialReviews={reviews}
              currentUserId={user?.id ?? null}
              canReview={canReview}
            />
          )}`;

if (t.includes(reviewsOld)) {
  t = t.replace(reviewsOld, reviewsNew);
  console.log("ReviewsSection wrapped.");
}

// 4. Wrap GOOD TO KNOW — matches the outer div
const gtkOld = `          <div className="mb-12">
            <h2 className="text-3xl font-bold mt-12 mb-4 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
              GOOD TO KNOW
            </h2>`;

const gtkNew = `          {activeTab === "good-to-know" && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mt-12 mb-4 uppercase" style={{ fontFamily: "var(--font-antonio)" }}>
              GOOD TO KNOW
            </h2>`;

if (t.includes(gtkOld)) {
  t = t.replace(gtkOld, gtkNew);
  // Need to close the conditional — find the closing </div> of the GOOD TO KNOW section
  // The section ends with `</dl>\n          </div>` — we add `)}` after
  const gtkClose = `            </dl>
          </div>`;
  const gtkCloseNew = `            </dl>
          </div>
          )}`;
  if (t.includes(gtkClose)) {
    // Replace the FIRST occurrence after gtkNew
    const idx = t.indexOf(gtkNew);
    const closeIdx = t.indexOf(gtkClose, idx);
    if (closeIdx > -1) {
      t = t.slice(0, closeIdx) + gtkCloseNew + t.slice(closeIdx + gtkClose.length);
      console.log("GOOD TO KNOW wrapped (open + close).");
    }
  }
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}