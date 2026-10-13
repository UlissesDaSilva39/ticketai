import Link from "next/link";

const TRUST = ["DJ Poxy","Basement 44","Voice Records","Pompeii Odyssey","Ulisses Booking","Demo Ticket"];

const PROBLEMS = [
  { bad: "SCATTERED", badText: "Gigs spread across ten apps and a hundred DMs.", good: "ONE FEED", goodText: "Every show, every artist, every city in one place." },
  { bad: "OPAQUE", badText: "Booking emails lost in inboxes. No visibility.", good: "ONE REQUEST", goodText: "Send a booking. Get a clear accept or decline." },
  { bad: "INVISIBLE", badText: "Artists never know who is actually listening.", good: "ONE DASHBOARD", goodText: "See views, cities, sources and trends in real time." },
];

const FEATURES = [
  { title: "Artist Page", body: "A Spotify-style profile with your music, shows, bio, and direct booking. One URL for your whole career." },
  { title: "Bookings", body: "Request, accept, decline. Promoters and artists see the same status in real time. No more chasing emails." },
  { title: "Ticketing", body: "Sell tickets directly from your page. No hidden fees. Instant settlement." },
  { title: "Social Layer", body: "Follow, message, share. A real network, not an algorithm-driven feed." },
  { title: "Analytics", body: "Views, cities, traffic sources, trends. Know your audience for the first time." },
  { title: "Notifications", body: "Email and in-app, in real time. Never miss a booking, a message or a follow." },
];

const ROLES = [
  { label: "ARTISTS", line: "Get booked. Get paid. Get seen.", href: "/login?role=artist", cta: "Start as artist" },
  { label: "PROMOTERS", line: "Fill rooms. Earn commission.", href: "/login?role=promoter", cta: "Start as promoter" },
  { label: "VENUES", line: "List your nights. Get discovered.", href: "/login?role=venue", cta: "Start as venue" },
  { label: "FANS", line: "Find your next night out.", href: "/login?role=attendee", cta: "Explore events" },
];

const STEPS = [
  { n: "01", title: "Create your profile", body: "Two minutes. Pick your role. Add your links." },
  { n: "02", title: "Build your audience", body: "Share your page, upload music, list shows." },
  { n: "03", title: "Book and sell", body: "Accept bookings, sell tickets, get paid." },
];

export default function Home() {
  return (
    <main className="bg-white text-black">
      <section className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32">
          <p className="text-xs md:text-sm tracking-[0.3em] text-gray-500 mb-6" style={{ fontFamily: "var(--font-antonio)" }}>
            THE NETWORK FOR MUSIC
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8 max-w-4xl" style={{ fontFamily: "var(--font-antonio)" }}>
            The network for live music.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Artists get booked. Promoters fill rooms. Venues get discovered. Fans find their next night. All in one place.
          </p>
          <div className="flex flex-wrap gap-4 mb-16">
            <Link href="/login" className="inline-flex items-center gap-2 bg-black text-white font-medium px-8 py-4 rounded-full hover:bg-gray-800 transition">
              Create free profile <span aria-hidden>&#8594;</span>
            </Link>
            <Link href="#how" className="inline-flex items-center gap-2 border border-gray-300 text-black font-medium px-8 py-4 rounded-full hover:border-gray-800 transition">
              See how it works
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
              <span className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="ml-4 text-xs text-gray-400">grid.music/home</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
              <div className="hidden md:block border border-gray-200 rounded-xl p-4 bg-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Your Library</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Home</p>
                  <p>Artists</p>
                  <p>My Tickets</p>
                  <p>Network</p>
                  <p>Opportunities</p>
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">B</div>
                    <div>
                      <p className="text-sm font-medium">bob is going to Folk & Whisky Festival</p>
                      <p className="text-xs text-gray-500">Mon 7 Dec</p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">A</div>
                    <div>
                      <p className="text-sm font-medium">alice started following DJ Poxy</p>
                      <p className="text-xs text-gray-500">2h</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-gray-200 py-6 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-gray-500 text-xs md:text-sm tracking-widest">
          <span className="text-gray-700 font-medium">TRUSTED BY LONDON&apos;S INDEPENDENT SCENE</span>
          {TRUST.map((name) => (
            <span key={name} className="flex items-center gap-2">
              <span className="text-gray-300">&#9671;</span>
              {name}
            </span>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-3 gap-8">
          {PROBLEMS.map((p, i) => (
            <div key={i} className="space-y-4">
              <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
                <p className="text-xs tracking-widest text-gray-400 mb-3">THE PROBLEM</p>
                <h3 className="text-2xl font-bold mb-2 text-gray-700" style={{ fontFamily: "var(--font-antonio)" }}>{p.bad}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.badText}</p>
              </div>
              <div className="text-center text-gray-300 text-2xl">&#8595;</div>
              <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                <p className="text-xs tracking-widest text-gray-500 mb-3">THE FIX</p>
                <h3 className="text-2xl font-bold mb-2 text-black" style={{ fontFamily: "var(--font-antonio)" }}>{p.good}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.goodText}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-50 border-y border-gray-200 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight text-black" style={{ fontFamily: "var(--font-antonio)" }}>
            WHAT YOU GET
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="border border-gray-200 rounded-2xl p-8 bg-white hover:border-gray-400 transition">
                <div className="w-8 h-8 rounded-full border border-gray-300 mb-6" />
                <h3 className="text-2xl font-bold mb-3 text-black" style={{ fontFamily: "var(--font-antonio)" }}>{feat.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight max-w-3xl text-black" style={{ fontFamily: "var(--font-antonio)" }}>
          BUILT FOR EVERYONE IN THE ROOM
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map((r) => (
            <Link key={r.label} href={r.href} className="border border-gray-200 rounded-2xl p-8 hover:border-gray-400 hover:bg-gray-50 transition group">
              <h3 className="text-3xl font-bold mb-3 text-black" style={{ fontFamily: "var(--font-antonio)" }}>{r.label}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{r.line}</p>
              <span className="text-sm text-black font-medium flex items-center gap-2">
                {r.cta} <span aria-hidden>&#8594;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section id="how" className="bg-gray-50 border-y border-gray-200 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight text-black" style={{ fontFamily: "var(--font-antonio)" }}>
            THREE STEPS. THAT IS IT.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="text-6xl md:text-7xl font-bold text-gray-200 mb-4" style={{ fontFamily: "var(--font-antonio)" }}>{s.n}</p>
                <h3 className="text-2xl font-bold mb-3 text-black" style={{ fontFamily: "var(--font-antonio)" }}>{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        <blockquote className="text-3xl md:text-5xl font-bold leading-tight mb-8 tracking-tight text-black" style={{ fontFamily: "var(--font-antonio)" }}>
          &ldquo;GRID is the first platform that actually understands how the underground works.&rdquo;
        </blockquote>
        <p className="text-gray-500 text-sm tracking-widest">- DJ POXY, LONDON</p>
      </section>
      <section className="bg-black text-white py-32 md:py-48">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>
            READY TO MOVE THE SCENE?
          </h2>
          <Link href="/login" className="inline-flex items-center gap-2 bg-white text-black font-medium px-10 py-5 rounded-full hover:bg-gray-100 transition text-lg">
            Create free <span aria-hidden>&#8594;</span>
          </Link>
          <p className="text-gray-400 text-sm mt-6">Free forever. No card needed.</p>
        </div>
      </section>
    </main>
  );
}
