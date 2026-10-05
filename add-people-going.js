const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");

if (t.includes("Your People Are Going")) {
  console.log("Already present.");
  process.exit(0);
}

// Insert right before the TRENDING section
const trendingStart = `      {/* TRENDING */}
      <section className="max-w-7xl mx-auto px-6 py-20">`;

const newSections = `      {/* YOUR PEOPLE ARE GOING */}
      {friendsGoingEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-20">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black text-white p-10">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-3">
              Your people are going
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold uppercase mb-6"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Friends are out this week
            </h2>
            <p className="text-white/70 mb-8 max-w-xl">
              {friendsGoingEvents.length} {friendsGoingEvents.length === 1 ? "event" : "events"} your friends are going to — see what they're up to.
            </p>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              {friendsGoingEvents.map((e) => (
                <a
                  key={e.id}
                  href={"/event/" + e.id}
                  className="block rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="relative h-40 overflow-hidden bg-gray-800">
                    {e.hero_image && (
                      <img src={e.hero_image} alt={e.title} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-widest text-white/50">
                      {formatEventDate(e.start_date)}
                    </p>
                    <h3 className="mt-1 font-semibold leading-tight">{e.title}</h3>
                  </div>
                </a>
              ))}
            </div>
            <a
              href="/feed"
              className="inline-block px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100"
            >
              See what they're doing
            </a>
          </div>
        </section>
      )}

${trendingStart}`;

if (t.includes(trendingStart)) {
  t = t.replace(trendingStart, newSections);
  fs.writeFileSync(p, t);
  console.log("'Your People Are Going' section added before 'What's hot'.");
} else {
  console.log("Trending anchor not found.");
}