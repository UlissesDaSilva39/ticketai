const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");

if (t.includes("Trending Now") && t.includes("Special Offers")) {
  console.log("Already present.");
  process.exit(0);
}

// Insert right after the What's hot section closes, before CITIES
const citiesStart = `      {/* CITIES */}`;

const newSections = `      {/* TRENDING NOW — genre tiles */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-6">
          <h2
            className="text-4xl md:text-5xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Trending now
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "House", q: "house" },
            { name: "Techno", q: "techno" },
            { name: "Hip-Hop", q: "hip-hop" },
            { name: "Afrobeats", q: "afrobeats" },
            { name: "Live Music", q: "live" },
            { name: "Comedy", q: "comedy" },
            { name: "Festivals", q: "festival" },
            { name: "Clubs", q: "club" },
          ].map((g) => (
            <a
              key={g.name}
              href={"/search?q=" + encodeURIComponent(g.q)}
              className="flex items-center justify-center h-24 rounded-xl border border-gray-200 font-semibold hover:border-black hover:bg-black hover:text-white transition-colors"
            >
              {g.name}
            </a>
          ))}
        </div>
      </section>

      {/* SPECIAL OFFERS */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2
            className="text-4xl md:text-5xl font-bold uppercase mb-8"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Special offers
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Early Bird", desc: "Save 20% on selected events", cta: "View offers" },
              { title: "Group Offer", desc: "4 tickets for £60", cta: "Browse groups" },
              { title: "Flash Sale", desc: "Until midnight only", cta: "See what's live" },
            ].map((o) => (
              <div key={o.title} className="rounded-xl border bg-white p-6">
                <p className="text-xs uppercase tracking-widest text-gray-500">{o.title}</p>
                <p className="mt-2 text-xl font-semibold">{o.desc}</p>
                <a
                  href="/search"
                  className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
                >
                  {o.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

${citiesStart}`;

if (t.includes(citiesStart)) {
  t = t.replace(citiesStart, newSections);
  fs.writeFileSync(p, t);
  console.log("'Trending Now' and 'Special Offers' sections added.");
} else {
  console.log("Cities anchor not found.");
}