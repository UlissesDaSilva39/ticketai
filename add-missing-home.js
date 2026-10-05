const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

/* ============================================================
   1. Example queries under the search bar
   ============================================================ */
const searchAnchor = `        <div className="mt-4 flex flex-wrap gap-2 justify-center">`;
const searchWithExamples = `        <div className="mt-4 text-center text-sm text-gray-500">
          Try:{" "}
          <a href="/search?q=house+music" className="underline underline-offset-4 hover:text-black">House music this Saturday</a>
          {" · "}
          <a href="/search?q=comedy" className="underline underline-offset-4 hover:text-black">Comedy tonight</a>
          {" · "}
          <a href="/search?q=under+30" className="underline underline-offset-4 hover:text-black">Events under £30</a>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">`;

if (t.includes(searchAnchor) && !t.includes("House music this Saturday</a>")) {
  t = t.replace(searchAnchor, searchWithExamples);
  console.log("1. Example queries added.");
}

/* ============================================================
   2. Add "Live Music" quick filter
   ============================================================ */
const filtersOld = `            { label: "Music", href: "/search?q=music" },
            { label: "Comedy", href: "/search?q=comedy" },`;
const filtersNew = `            { label: "Music", href: "/search?q=music" },
            { label: "Live Music", href: "/search?q=live" },
            { label: "Comedy", href: "/search?q=comedy" },`;

if (t.includes(filtersOld) && !t.includes('label: "Live Music"')) {
  t = t.replace(filtersOld, filtersNew);
  console.log("2. Live Music filter added.");
}

/* ============================================================
   3. Add going count + Get Tickets button to event cards
   Only modifying the events.map in the "What's hot" section
   ============================================================ */
const cardOld = `                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {formatEventDate(e.start_date)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">
                      {e.title}
                    </h3>
                    {from !== null && (
                      <p className="mt-3 text-sm font-medium">
                        From £{from.toFixed(2)}
                      </p>
                    )}
                  </div>`;

const cardNew = `                  <div className="p-5">
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {formatEventDate(e.start_date)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight">
                      {e.title}
                    </h3>
                    {from !== null && (
                      <p className="mt-3 text-sm font-medium">
                        From £{from.toFixed(2)}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        🔥 {e.views ?? 0} interested
                      </span>
                      <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium">
                        Get Tickets
                      </span>
                    </div>
                  </div>`;

if (t.includes(cardOld) && !t.includes("Get Tickets</span>")) {
  t = t.replace(cardOld, cardNew);
  console.log("3. Going count + Get Tickets button added.");
}

/* ============================================================
   4. Discover More block — insert before the promoter section
   ============================================================ */
const discoverAnchor = `      {/* FOR PROMOTERS */}`;
const discoverMore = `      {/* DISCOVER MORE */}
      <section className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold uppercase mb-6"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Discover more
          </h2>
          <Link
            href="/search"
            className="inline-block rounded-full bg-black text-white px-8 py-4 font-semibold hover:bg-gray-800"
          >
            Browse all events
          </Link>
        </div>
      </section>

${discoverAnchor}`;

if (t.includes(discoverAnchor) && !t.includes("Discover more</h2>")) {
  t = t.replace(discoverAnchor, discoverMore);
  console.log("4. Discover More section added.");
}

/* ============================================================
   5. Footer tagline
   ============================================================ */
const footerAnchor = `© 2026 TicketAI. All rights reserved.`;
const footerNew = `© 2026 TicketAI. All rights reserved.`;

// Footer is in layout.tsx, not page.tsx — skipping here

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}