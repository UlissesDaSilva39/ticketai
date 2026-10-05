const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (t.includes("House music this Saturday")) {
  console.log("Search section already present.");
  process.exit(0);
}

// Insert right after the closing </section> of the hero
const heroEnd = `          <p className="mt-6 text-sm text-white/60">
            No booking fees · Free for promoters and venues
          </p>
        </div>
      </section>`;

const searchSection = heroEnd + `

      {/* SEARCH + QUICK FILTERS */}
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
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {[
            { label: "Tonight", href: "/search?when=tonight" },
            { label: "This Weekend", href: "/search?when=weekend" },
            { label: "Music", href: "/search?q=music" },
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
  fs.writeFileSync(p, t);
  console.log("Search + filters section added.");
} else {
  console.log("Hero anchor not found. Checking...");
  const idx = t.indexOf("No booking fees");
  console.log(JSON.stringify(t.slice(idx - 100, idx + 200)));
}