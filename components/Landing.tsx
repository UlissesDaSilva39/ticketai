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
      <section className="bg-gray-50 border-y border-gray-200 py-20">
<div className="max-w-6xl mx-auto px-6">
<div className="text-center mb-12">
<a href="/" className="block mb-12 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md hover:border-violet-300 transition"><img src="/screenshots/home.svg" alt="GRID home page" className="w-full" /></a>
            <h2 className="text-4xl font-bold mb-3">See it in action</h2>
<p className="text-gray-600">Real pages from GRID - click any to explore.</p>
</div>
<div className="mb-12">
<div className="flex items-center justify-between mb-4">
<div>
<div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">Artist Pages</div>
<a href="/artists" className="block mb-6 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md hover:border-violet-300 transition"><img src="/screenshots/artists.svg" alt="GRID artists page" className="w-full" /></a>
            <h3 className="text-2xl font-bold">Your career, one URL</h3>
</div>

</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{[
{ name: 'DJ Poxy', role: 'DJ - House', city: 'London', followers: '150k', initials: 'DP', slug: 'dj-poxy' },
{ name: 'Paper Lions', role: 'Band - Jazz Fusion', city: 'Paris', followers: '45k', initials: 'PL', slug: 'paper-lions' },
{ name: 'Basement Collective', role: 'Band - Techno', city: 'London', followers: '12k', initials: 'BC', slug: 'basement-collective' },
].map((a) => (
<a key={a.name} href={'/artists/' + a.slug} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-violet-300 transition">
<div className="flex items-start gap-4 mb-4">
<div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center font-bold">{a.initials}</div>
<div>
<div className="font-semibold flex items-center gap-1">{a.name}<span className="text-green-500 text-xs">V</span></div>
<div className="text-sm text-gray-500">{a.role} - {a.city}</div>
</div>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-gray-500">{a.followers} followers</span>
<span className="text-violet-600 font-medium">View profile</span>
</div>
</a>
))}
</div>
</div>
<div>
<div className="flex items-center justify-between mb-4">
<div>
<div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">Event Pages</div>
<a href="/discover/events" className="block mb-6 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md hover:border-violet-300 transition"><img src="/screenshots/events.svg" alt="GRID events page" className="w-full" /></a>
            <h3 className="text-2xl font-bold">Sell tickets your way</h3>
</div>

</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{[
{ title: 'Paper Lions Jazz Night', venue: 'The Blue Note - London', date: 'Tue, 3 Nov - 19:16', price: '25', sold: '87%', tag: 'Selling fast' },
{ title: 'Basement Collective Presents', venue: 'Basement 44 - London', date: 'Mon, 2 Nov - 17:16', price: '20', sold: '93%', tag: 'Selling fast' },
{ title: 'Analog Dreams Live', venue: 'Fabric - London', date: 'Sat, 24 Oct - 18:16', price: '16', sold: '93%', tag: 'Last tickets' },
].map((e) => (
<a key={e.title} href="/discover/events" className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:border-violet-300 transition">
<div className="h-32 bg-gradient-to-br from-violet-200 to-pink-200 relative">
<div className="absolute bottom-3 right-3 rounded-full bg-red-500 text-white text-xs px-2 py-1 font-medium">{e.tag}</div>
</div>
<div className="p-4">
<h4 className="font-semibold mb-1">{e.title}</h4>
<div className="text-xs text-gray-500 mb-3">{e.venue}<br/>{e.date}</div>
<div className="flex items-center justify-between pt-3 border-t border-gray-100">
<div><div className="text-xs text-gray-500">From</div><div className="font-bold">{e.price}</div></div>
<div className="text-xs text-gray-500">{e.sold} sold</div>
</div>
</div>
</a>
))}
</div>
</div>
</div>
</section>
<section className="max-w-6xl mx-auto px-6 py-12"><a href="/discover/venues" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md hover:border-violet-300 transition"><img src="/screenshots/venues.svg" alt="GRID venues page" className="w-full" /></a></section>
<section className="max-w-6xl mx-auto px-6 py-20">
<div className="text-center mb-12">
<h2 className="text-4xl font-bold mb-3">{/* ============ SECTION A - SELL TICKETS / FILL ROOMS ============ */}
<section className="bg-gray-50 border-y border-gray-200 py-20">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-3">Sell tickets. Fill rooms. Get booked.</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">Every tool you need to run a night — face-value resale, escrow payments, instant payouts. All in one place.</p>
    </div>

    <div className="space-y-20">

      {/* EVENTS */}
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/2 flex-shrink-0">
          <a href="/discover/events" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-violet-300 transition">
            <img src="/screenshots/events.svg" alt="Events page" className="w-full" />
          </a>
        </div>
        <div className="w-full md:w-1/2">
          <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">Events</div>
          <h3 className="text-2xl font-bold mb-3">Sell tickets your way — no hidden fees</h3>
          <p className="text-gray-600 mb-4">Sell directly from your page. Face-value resale with anti-tout protection. Waitlists for sold-out shows. Every transaction protected by escrow.</p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>2-click checkout with saved cards, Apple Pay, Google Pay</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Face-value resale — anti-tout protection, no scalping</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>33% higher conversion than standard checkout</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Instant payouts — get paid the day after the event</li>
          </ul>
          <a href="/discover/events" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
            Browse events
          </a>
        </div>
      </div>

      {/* VENUES */}
      <div className="flex flex-col md:flex-row-reverse items-start gap-8">
        <div className="w-full md:w-1/2 flex-shrink-0">
          <a href="/discover/venues" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-violet-300 transition">
            <img src="/screenshots/venues.svg" alt="Venues page" className="w-full" />
          </a>
        </div>
        <div className="w-full md:w-1/2">
          <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">Venues</div>
          <h3 className="text-2xl font-bold mb-3">Fill every night on your calendar</h3>
          <p className="text-gray-600 mb-4">List your space. Get booked by verified promoters. Track revenue per night. No more empty Tuesdays. Real-time availability calendar and occupancy analytics.</p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Verified promoter bookings with escrow protection</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Revenue per night + occupancy analytics dashboard</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Compliance, capacity, and staff management</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Bar and food upsell at checkout</li>
          </ul>
          <a href="/venues/join" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
            List your venue
          </a>
        </div>
      </div>

      {/* PROMOTERS */}
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/2 flex-shrink-0">
          <a href="/discover/promoters" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-violet-300 transition">
            <img src="/screenshots/promoters.svg" alt="Promoters page" className="w-full" />
          </a>
        </div>
        <div className="w-full md:w-1/2">
          <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">Promoters</div>
          <h3 className="text-2xl font-bold mb-3">The people who fill rooms</h3>
          <p className="text-gray-600 mb-4">Discover verified promoters in your city. See their past events, audience reach, and reputation. Book them directly with escrow protection.</p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Verified profiles with full event history</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Direct booking with escrow — no more chasing emails</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Track record — reviews from venues</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Audience demographics — know who you're reaching</li>
          </ul>
          <a href="/promoters/join" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
            Become a promoter
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

{/* ============ SECTION B - BUILD YOUR CAREER ============ */}
<section className="max-w-6xl mx-auto px-6 py-20">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold mb-3">Build your career. Get discovered.</h2>
    <p className="text-gray-600 max-w-2xl mx-auto">One URL for your whole career. Talk to the industry. Find your next gig.</p>
  </div>

  <div className="space-y-20">

    {/* ARTISTS */}
    <div className="flex flex-col md:flex-row-reverse items-start gap-8">
      <div className="w-full md:w-1/2 flex-shrink-0">
        <a href="/artists" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-violet-300 transition">
          <img src="/screenshots/artists.svg" alt="Artists page" className="w-full" />
        </a>
      </div>
      <div className="w-full md:w-1/2">
        <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">Artists</div>
        <h3 className="text-2xl font-bold mb-3">Your career, one URL</h3>
        <p className="text-gray-600 mb-4">DJs, producers, bands, vocalists. Filter by genre, city, availability. Every profile is verified with a music player, shows, bio, and direct booking.</p>
        <ul className="space-y-2 text-sm text-gray-700 mb-6">
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Verified artist profiles with embedded music player</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Booking requests directly to your inbox</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Analytics dashboard — see who's actually listening</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Instant payout after every show</li>
        </ul>
        <a href="/artists" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
          Browse 45,000+ artists
        </a>
      </div>
    </div>

    {/* MESSAGES */}
    <div className="flex flex-col md:flex-row items-start gap-8">
      <div className="w-full md:w-1/2 flex-shrink-0">
        <a href="/messages" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-violet-300 transition">
          <img src="/screenshots/messages.svg" alt="Messages page" className="w-full" />
        </a>
      </div>
      <div className="w-full md:w-1/2">
        <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">Messages</div>
        <h3 className="text-2xl font-bold mb-3">Talk directly to the industry</h3>
        <p className="text-gray-600 mb-4">No more chasing emails. Message promoters, venues, artists, and managers in one inbox. Contracts sent and signed inside the app — no third-party tools.</p>
        <ul className="space-y-2 text-sm text-gray-700 mb-6">
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Real-time messaging with read receipts</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Contract signing inside the app</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Message history kept — searchable for reference</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Group threads for multi-party bookings</li>
        </ul>
        <a href="/messages" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
          Open messages
        </a>
      </div>
    </div>

    {/* OPPORTUNITIES */}
    <div className="flex flex-col md:flex-row-reverse items-start gap-8">
      <div className="w-full md:w-1/2 flex-shrink-0">
        <a href="/opportunities" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-violet-300 transition">
          <img src="/screenshots/opportunities.svg" alt="Opportunities page" className="w-full" />
        </a>
      </div>
      <div className="w-full md:w-1/2">
        <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">Opportunities</div>
        <h3 className="text-2xl font-bold mb-3">Gigs, jobs, collaborations</h3>
        <p className="text-gray-600 mb-4">Every open role in one feed. Bookings, freelance gigs, session work, and collaborations. Apply with your GRID profile in one click.</p>
        <ul className="space-y-2 text-sm text-gray-700 mb-6">
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Filter by genre, city, and budget</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>One-click apply with your profile</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Direct messaging with hirers before accepting</li>
          <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Escrow-protected payment on acceptance</li>
        </ul>
        <a href="/opportunities" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
          See opportunities
        </a>
      </div>
    </div>

  </div>
</section>

{/* ============ SECTION C - SELL MORE THAN TICKETS ============ */}
<section className="bg-gray-50 border-y border-gray-200 py-20">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-3">Sell more than tickets.</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">Merch, music, VIP bundles. All in one checkout. 30% average revenue uplift per fan.</p>
    </div>

    <div className="space-y-20">

      {/* MERCH */}
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-full md:w-1/2 flex-shrink-0">
          <a href="/merch" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-violet-300 transition">
            <img src="/screenshots/merch.svg" alt="Merch page" className="w-full" />
          </a>
        </div>
        <div className="w-full md:w-1/2">
          <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">Merch</div>
          <h3 className="text-2xl font-bold mb-3">Official merch, direct from artists</h3>
          <p className="text-gray-600 mb-4">Artists sell official merch directly to fans. T-shirts, vinyl, VIP bundles. Fans pay at checkout with their ticket. No middleman fees.</p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Sell merch + tickets in one checkout</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Print-on-demand integration — no inventory</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>30% average revenue uplift per fan</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Fans get merch shipped with ticket confirmation</li>
          </ul>
          <a href="/merch" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
            Browse merch
          </a>
        </div>
      </div>

      {/* HOME */}
      <div className="flex flex-col md:flex-row-reverse items-start gap-8">
        <div className="w-full md:w-1/2 flex-shrink-0">
          <a href="/" className="block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-violet-300 transition">
            <img src="/screenshots/home.svg" alt="GRID home" className="w-full" />
          </a>
        </div>
        <div className="w-full md:w-1/2">
          <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">The network</div>
          <h3 className="text-2xl font-bold mb-3">One feed for everything</h3>
          <p className="text-gray-600 mb-4">Artists, promoters, venues, and fans in one place. Create your free profile in 2 minutes. Pick your role. Add your links. Start booking.</p>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Discover events, artists, promoters in one feed</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Follow who matters — curated, not algorithmic</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>Free forever — only pay when you sell tickets</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold">✓</span>4 million+ monthly visitors</li>
          </ul>
          <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-neutral-800">
            Create free profile
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

{/* ============ SECTION D - REAL PEOPLE ============ */}
<section className="max-w-6xl mx-auto px-6 py-20">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold mb-3">Real people. Real rooms. Real nights.</h2>
    <p className="text-gray-600 max-w-2xl mx-auto">Meet some of the artists, venues, and promoters already on GRID. 45,000+ verified profiles.</p>
  </div>

  <div className="mb-16">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold">Featured artists</h3>
      <a href="/artists" className="text-sm font-medium text-violet-600 hover:text-violet-700">View all 45,000+ →</a>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[
        { name: 'DJ Poxy', role: 'DJ - House', city: 'London', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
        { name: 'Ultra Nate', role: 'Vocalist', city: 'London', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop' },
        { name: 'Honey Dijon', role: 'DJ - Techno', city: 'Chicago', img: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=300&h=300&fit=crop' },
        { name: 'Floating Points', role: 'Producer', city: 'Manchester', img: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop' },
        { name: 'Peggy Gou', role: 'DJ - House', city: 'Berlin', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop' },
        { name: 'Four Tet', role: 'Producer', city: 'London', img: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=300&h=300&fit=crop' },
      ].map((a) => (
        <div key={a.name} className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md hover:border-violet-300 transition group cursor-pointer">
          <img src={a.img} alt={a.name} className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300" />
          <div className="p-3">
            <div className="font-semibold text-sm">{a.name}</div>
            <div className="text-xs text-gray-500">{a.role} - {a.city}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className="mb-16">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold">Featured venues</h3>
      <a href="/discover/venues" className="text-sm font-medium text-violet-600 hover:text-violet-700">View all 8,000+ →</a>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[
        { name: 'Fabric', city: 'London', cap: '1,600 cap', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop' },
        { name: 'Berghain', city: 'Berlin', cap: '1,500 cap', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&h=300&fit=crop' },
        { name: 'The Warehouse', city: 'Amsterdam', cap: '2,000 cap', img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop' },
        { name: 'Basement 44', city: 'London', cap: '300 cap', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' },
        { name: 'Blue Note', city: 'Paris', cap: '500 cap', img: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop' },
        { name: 'Village Underground', city: 'London', cap: '700 cap', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop' },
      ].map((v) => (
        <div key={v.name} className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md hover:border-violet-300 transition group cursor-pointer">
          <img src={v.img} alt={v.name} className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300" />
          <div className="p-3">
            <div className="font-semibold text-sm">{v.name}</div>
            <div className="text-xs text-gray-500">{v.city} - {v.cap}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold">Featured promoters</h3>
      <a href="/discover/promoters" className="text-sm font-medium text-violet-600 hover:text-violet-700">View all 12,000+ →</a>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[
        { name: 'Nightshift Presents', city: 'London', events: '24 events', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
        { name: 'Techno Nation', city: 'London', events: '31 events', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop' },
        { name: 'Electronic Europe', city: 'Amsterdam', events: '19 events', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop' },
        { name: 'East End Promotions', city: 'London', events: '22 events', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' },
        { name: 'Bristol Underground', city: 'Bristol', events: '15 events', img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop' },
        { name: 'DnB Nation', city: 'London', events: '28 events', img: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop' },
      ].map((p) => (
        <div key={p.name} className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md hover:border-violet-300 transition group cursor-pointer">
          <img src={p.img} alt={p.name} className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300" />
          <div className="p-3">
            <div className="font-semibold text-sm">{p.name}</div>
            <div className="text-xs text-gray-500">{p.city} - {p.events}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      <section className="max-w-6xl mx-auto px-6 py-20">
  <div className="text-center mb-12">
    <h2 className="text-4xl font-bold mb-3">Real people. Real rooms. Real nights.</h2>
    <p className="text-gray-600">Meet some of the artists, venues, and promoters already on GRID.</p>
  </div>

  <div className="mb-12">
    <h3 className="text-xl font-bold mb-4">Artists</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[
        { name: 'DJ Poxy', city: 'London', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
        { name: 'Ultra Nate', city: 'London', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop' },
        { name: 'Honey Dijon', city: 'Chicago', img: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=300&h=300&fit=crop' },
        { name: 'Floating Points', city: 'Manchester', img: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop' },
        { name: 'Peggy Gou', city: 'Berlin', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop' },
        { name: 'Four Tet', city: 'London', img: 'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=300&h=300&fit=crop' },
      ].map((a) => (
        <div key={a.name} className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md hover:border-violet-300 transition">
          <img src={a.img} alt={a.name} className="w-full aspect-square object-cover" />
          <div className="p-3">
            <div className="font-semibold text-sm">{a.name}</div>
            <div className="text-xs text-gray-500">{a.city}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className="mb-12">
    <h3 className="text-xl font-bold mb-4">Venues</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[
        { name: 'Fabric', city: 'London', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop' },
        { name: 'Berghain', city: 'Berlin', img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&h=300&fit=crop' },
        { name: 'The Warehouse', city: 'Amsterdam', img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop' },
        { name: 'Basement 44', city: 'London', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' },
        { name: 'Blue Note', city: 'Paris', img: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop' },
        { name: 'Village Underground', city: 'London', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop' },
      ].map((v) => (
        <div key={v.name} className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md hover:border-violet-300 transition">
          <img src={v.img} alt={v.name} className="w-full aspect-square object-cover" />
          <div className="p-3">
            <div className="font-semibold text-sm">{v.name}</div>
            <div className="text-xs text-gray-500">{v.city}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div>
    <h3 className="text-xl font-bold mb-4">Promoters</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[
        { name: 'Nightshift Presents', city: 'London', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
        { name: 'Techno Nation', city: 'London', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop' },
        { name: 'Electronic Europe', city: 'Amsterdam', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop' },
        { name: 'East End Promotions', city: 'London', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop' },
        { name: 'Bristol Underground', city: 'Bristol', img: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&h=300&fit=crop' },
        { name: 'DnB Nation', city: 'London', img: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop' },
      ].map((p) => (
        <div key={p.name} className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-md hover:border-violet-300 transition">
          <img src={p.img} alt={p.name} className="w-full aspect-square object-cover" />
          <div className="p-3">
            <div className="font-semibold text-sm">{p.name}</div>
            <div className="text-xs text-gray-500">{p.city}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      Why not just use...?</h2>
<p className="text-gray-600">RA, Dice, Eventbrite and Bandcamp each solve one piece. GRID solves all of them.</p>
</div>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead>
<tr className="border-b-2 border-gray-200">
<th className="text-left py-4 pr-4 font-semibold">Feature</th>
<th className="px-3 py-4 font-semibold text-violet-600">GRID</th>
<th className="px-3 py-4 font-semibold text-gray-400">RA</th>
<th className="px-3 py-4 font-semibold text-gray-400">Dice</th>
<th className="px-3 py-4 font-semibold text-gray-400">Eventbrite</th>
<th className="px-3 py-4 font-semibold text-gray-400">Bandcamp</th>
</tr>
</thead>
<tbody>
{[
{ f: 'Artist page with music + booking', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '~' },
{ f: 'Direct booking (accept/decline)', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '-' },
{ f: 'Sell tickets on your own page', grid: 'V', ra: '-', dice: '~', eb: 'V', bc: 'V' },
{ f: 'Face-value resale', grid: 'V', ra: 'V', dice: 'V', eb: '-', bc: '-' },
{ f: '2-click payment', grid: 'V', ra: 'V', dice: 'V', eb: '-', bc: '-' },
{ f: 'Promoter discovery', grid: 'V', ra: 'V', dice: '~', eb: '-', bc: '-' },
{ f: 'Venue listing + booking', grid: 'V', ra: '~', dice: '-', eb: '-', bc: '-' },
{ f: 'Analytics dashboard', grid: 'V', ra: '~', dice: 'V', eb: 'V', bc: '~' },
{ f: 'Social network (follow + DM)', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '-' },
{ f: 'Industry marketplace', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '-' },
{ f: 'Rider system', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '-' },
{ f: 'Free to join', grid: 'V', ra: '-', dice: '-', eb: 'V', bc: 'V' },
].map((row) => (
<tr key={row.f} className="border-b border-gray-100">
<td className="py-3 pr-4 text-gray-700">{row.f}</td>
<td className="text-center px-3 py-3 font-bold text-green-600">{row.grid}</td>
<td className="text-center px-3 py-3 text-gray-400">{row.ra}</td>
<td className="text-center px-3 py-3 text-gray-400">{row.dice}</td>
<td className="text-center px-3 py-3 text-gray-400">{row.eb}</td>
<td className="text-center px-3 py-3 text-gray-400">{row.bc}</td>
</tr>
))}
</tbody>
</table>
</div>
<p className="text-xs text-gray-400 mt-4 text-center">V Full support - ~ Partial - - Not available</p>
</section>
<section className="bg-gray-50 border-y border-gray-200 py-16">
<div className="max-w-6xl mx-auto px-6">
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
{[
{ label: 'Artists', value: '45,000+' },
{ label: 'Promoters', value: '12,000+' },
{ label: 'Venues', value: '8,000+' },
{ label: 'Events', value: '120,000+' },
].map((s) => (
<div key={s.label}>
<div className="text-3xl font-bold text-violet-600">{s.value}</div>
<div className="text-sm text-gray-500 mt-1">{s.label}</div>
</div>
))}
</div>
</div>
</section>
<section className="max-w-6xl mx-auto px-6 py-20">
<div className="text-center mb-12">
<h2 className="text-4xl font-bold mb-3">Everything you need, on GRID</h2>
<p className="text-gray-600">Built from research on RA, Dice, Spotify, Sony Music and Universal.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{[
{ title: 'Face-Value Resale', desc: 'List tickets at face value or below. Anti-tout protection. Waitlists for sold-out shows.', who: 'RA, Dice standard' },
{ title: '2-Click Payment', desc: 'One-tap checkout with saved cards, Apple Pay and Google Pay. 33% higher conversion.', who: 'RA model' },
{ title: 'Music on Your Profile', desc: 'Embed Spotify, SoundCloud and Bandcamp. Show top tracks. Separate Events and Listen tabs.', who: 'Bandcamp, Spotify standard' },
{ title: 'Structured Pitching', desc: 'Artists pitch to verified bookers. Platform matches by genre, market and experience.', who: 'BandPitch model' },
{ title: 'Earnings Dashboard', desc: 'Real-time view of ticket sales, bookings, marketplace services and payouts. Export CSV.', who: 'Sony, UMG standard' },
{ title: 'Industry Marketplace', desc: 'Hire producers, engineers, designers, photographers. Escrow, references and riders built in.', who: 'GRID unique' },
].map((f) => (
<div key={f.title} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-violet-300 transition">
<h3 className="text-xl font-bold mb-2">{f.title}</h3>
<p className="text-sm text-gray-600 mb-3">{f.desc}</p>
<div className="text-xs font-medium uppercase tracking-wider text-violet-600">{f.who}</div>
</div>
))}
</div>
</section>
<section className="bg-gray-50 border-y border-gray-200 py-20">
<div className="max-w-3xl mx-auto px-6">
<h2 className="text-4xl font-bold mb-12 text-center">Questions</h2>
<div className="space-y-4">
{[
{ q: 'Is GRID free?', a: 'Yes. Free forever. No card needed. Only pay when you sell tickets (5% fee).' },
{ q: 'How is this different from Resident Advisor?', a: 'RA is a listings site. GRID is a full career platform - booking, ticketing, resale, analytics, marketplace, riders and a social network, all in one place.' },
{ q: 'How is this different from Dice?', a: 'Dice is fan-focused. GRID is built for the entire industry - artists, promoters, venues and every role behind the scenes. Like Dice, we do face-value resale and 2-click payment.' },
{ q: 'Can I keep my Bandcamp?', a: 'Yes. GRID does not own your music. Keep selling on Bandcamp. Use GRID for booking, live shows and analytics.' },
{ q: 'Do you charge for resale?', a: 'GRID takes 5% on resale - paid by the buyer. Original seller always gets face value back. Anti-tout protections lock tickets until 24h before the event.' },
{ q: 'What is the marketplace?', a: 'Hire producers, engineers, designers, photographers and every role in live music - with escrow, references and riders. Like Fiverr, but for live music.' },
].map((item) => (
<details key={item.q} className="rounded-lg border border-gray-200 bg-white p-5 group">
<summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
{item.q}
<span className="text-gray-400 group-open:rotate-45 transition">+</span>
</summary>
<p className="text-sm text-gray-600 mt-3">{item.a}</p>
</details>
))}
</div>
</div>
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





