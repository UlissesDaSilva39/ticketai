const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");
// Normalize to LF so anchors match regardless of OS line endings
t = t.replace(/\r\n/g, "\n");
let changed = false;

/* ============================================================
   1. Hero search bar + example queries + quick filters
   ============================================================ */
if (!t.includes("House music this Saturday")) {
  const heroEnd = `          <p className="mt-6 text-sm text-white/60">
            No booking fees · Free for promoters and venues
          </p>
        </div>
      </section>`;

  const searchSection = heroEnd + `

      <section className="max-w-4xl mx-auto px-6 -mt-6 relative z-10">
        <form
          action="/search"
          method="get"
          className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2 border border-gray-100"
        >
          <input
            name="q"
            placeholder="House music this Saturday..."
            className="flex-1 px-5 py-3 text-base outline-none rounded-xl"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800"
          >
            Find Events
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-500">
          Try: <a href="/search?q=house" className="underline hover:text-black">House music this Saturday</a> · <a href="/search?q=comedy" className="underline hover:text-black">Comedy tonight</a> · <a href="/search?q=under+30" className="underline hover:text-black">Events under 30</a>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {[
            { label: "Tonight", href: "/search?when=tonight" },
            { label: "This Weekend", href: "/search?when=weekend" },
            { label: "Music", href: "/search?q=music" },
            { label: "Live Music", href: "/search?q=live" },
            { label: "Comedy", href: "/search?q=comedy" },
            { label: "Festivals", href: "/search?q=festival" },
            { label: "Clubs", href: "/search?q=club" },
            { label: "Sports", href: "/search?q=sports" },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="px-4 py-2 text-sm font-medium rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-colors"
            >
              {c.label}
            </a>
          ))}
        </div>
      </section>`;

  if (t.includes(heroEnd)) {
    t = t.replace(heroEnd, searchSection);
    console.log("1. Hero search + examples + filters added.");
    changed = true;
  } else {
    console.log("1. MISS — hero anchor still not found.");
  }
} else {
  console.log("1. Already present.");
}

/* ============================================================
   2. Get Tickets button + interested count on event cards
   ============================================================ */
if (!t.includes("Get Tickets</span>")) {
  const cardOld = `                      <p className="mt-3 text-sm font-medium">
                        From £{from.toFixed(2)}
                      </p>
                    )}
                  </div>`;

  const cardNew = `                      <p className="mt-3 text-sm font-medium">
                        From £{from.toFixed(2)}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{e.views ?? 0} interested</span>
                      <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium">Get Tickets</span>
                    </div>
                  </div>`;

  if (t.includes(cardOld)) {
    t = t.replace(cardOld, cardNew);
    console.log("2. Get Tickets + interested count added.");
    changed = true;
  } else {
    console.log("2. MISS — card anchor still not found.");
  }
} else {
  console.log("2. Already present.");
}

if (changed) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}