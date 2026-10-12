import Link from "next/link";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  "https://images.unsplash.com/photo-1571266028243-d220bc9c8a1a?w=800&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80",
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
  "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80",
];

const TRUST = ["DJ Poxy","Basement 44","Voice Records","Pomoer Odyssey","Ulisses Booking","Demo Ticket"];

const PROBLEMS = [
  { bad: "SCATTERED", badText: "Gigs spread across ten apps and a hundred DMs.", good: "ONE FEED", goodText: "Every show, every artist, every city in one place." },
  { bad: "OPAQUE", badText: "Booking emails lost in inboxes. No visibility.", good: "ONE REQUEST", goodText: "Send a booking. Get a clear accept or decline." },
  { bad: "INVISIBLE", badText: "Artists never know who is actually listening.", good: "ONE DASHBOARD", goodText: "See views, cities, sources and trends in real time." },
];

const FEATURES = [
  { title: "Artist Page", body: "Spotify-style profile with music, shows, bio, and direct booking." },
  { title: "Bookings", body: "Request, accept, decline. Everyone gets notified instantly." },
  { title: "Ticketing", body: "Sell directly. No hidden fees. Instant settlement." },
  { title: "Social Layer", body: "Follow, message, share. A real network, not a feed." },
  { title: "Analytics", body: "Views, cities, sources, trends. Know your audience." },
  { title: "Notifications", body: "Email and in-app, in real time. Never miss a move." },
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
    <main className="bg-black text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 opacity-40 blur-sm scale-110">
            {HERO_IMAGES.map((src, i) => (
              <img key={i} src={src} alt="" className="w-full h-64 md:h-96 object-cover" />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-32 md:pt-40 md:pb-48">
          <p className="text-xs md:text-sm tracking-[0.3em] text-white/60 mb-6" style={{ fontFamily: "var(--font-antonio)" }}>DISCOVER - CONNECT - CREATE - BOOK - GROW</p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-8 max-w-4xl" style={{ fontFamily: "var(--font-antonio)" }}>THE MUSIC<br />NETWORK.</h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed">Built for artists, promoters, venues and the fans who make the scene move. Everything in one place - profile, bookings, tickets, analytics.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="inline-flex items-center gap-2 bg-white text-black font-medium px-8 py-4 rounded-full hover:bg-white/90 transition">Start free <span aria-hidden>&#8594;</span></Link>
            <Link href="#how" className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-4 rounded-full hover:border-white/60 transition">See how it works</Link>
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/40 text-xs md:text-sm tracking-widest">
          <span className="text-white/60">BUILT FOR LONDON INDEPENDENT SCENE</span>
          {TRUST.map((name) => (<span key={name} className="flex items-center gap-2"><span className="text-white/30">&#9671;</span>{name}</span>))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-3 gap-8">
          {PROBLEMS.map((p, i) => (
            <div key={i} className="space-y-4">
              <div className="border border-white/10 rounded-2xl p-6 bg-white/[0.02]">
                <p className="text-xs tracking-widest text-white/40 mb-3">THE PROBLEM</p>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-antonio)" }}>{p.bad}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.badText}</p>
              </div>
              <div className="text-center text-white/30 text-2xl">&#8595;</div>
              <div className="border border-white/20 rounded-2xl p-6 bg-white/[0.04]">
                <p className="text-xs tracking-widest text-white/60 mb-3">THE FIX</p>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-antonio)" }}>{p.good}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{p.goodText}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white/[0.02] border-y border-white/10 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>WHAT YOU GET</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="border border-white/10 rounded-2xl p-8 hover:border-white/30 hover:bg-white/[0.03] transition">
                <div className="w-8 h-8 rounded-full border border-white/40 mb-6" />
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>{feat.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight max-w-3xl" style={{ fontFamily: "var(--font-antonio)" }}>BUILT FOR EVERYONE IN THE ROOM</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map((r) => (
            <Link key={r.label} href={r.href} className="border border-white/10 rounded-2xl p-8 hover:border-white/40 hover:bg-white/[0.03] transition group">
              <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>{r.label}</h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">{r.line}</p>
              <span className="text-sm text-white/80 group-hover:text-white flex items-center gap-2">{r.cta} <span aria-hidden>&#8594;</span></span>
            </Link>
          ))}
        </div>
      </section>
      <section id="how" className="bg-white/[0.02] border-y border-white/10 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>THREE STEPS. THAT IS IT.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="text-6xl md:text-7xl font-bold text-white/20 mb-4" style={{ fontFamily: "var(--font-antonio)" }}>{s.n}</p>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        <blockquote className="text-3xl md:text-5xl font-bold leading-tight mb-8 tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>&ldquo;GRID is the first platform that actually understands how the underground works.&rdquo;</blockquote>
        <p className="text-white/50 text-sm tracking-widest">- DJ POXY, LONDON</p>
      </section>
      <section className="border-t border-white/10 py-32 md:py-48">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-8xl font-bold mb-10 tracking-tight" style={{ fontFamily: "var(--font-antonio)" }}>READY TO MOVE<br />THE SCENE?</h2>
          <Link href="/login" className="inline-flex items-center gap-2 bg-white text-black font-medium px-10 py-5 rounded-full hover:bg-white/90 transition text-lg">Create free <span aria-hidden>&#8594;</span></Link>
          <p className="text-white/40 text-sm mt-6">Free forever. No card needed.</p>
        </div>
      </section>
    </main>
  );
}
