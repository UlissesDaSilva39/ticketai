import Link from "next/link";
import MiniInterestButtons from "@/components/MiniInterestButtons";
import MiniFriendsGoing from "@/components/MiniFriendsGoing";
import MiniFollowButton from "@/components/MiniFollowButton";
import ShareButtonMini from "@/components/ShareButtonMini";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TicketAI — Find your next event",
  description:
    "Discover house, techno, live music, and comedy events near you. No booking fees. Free for promoters.",
};

type TrendingEvent = {
  organizer_id?: string | null;
  id: string;
  title: string;
  start_date: string | null;
  hero_image: string | null;
  ticket_types: Array<{ name: string; price: number }> | null;
  venue_id: string | null;
};

function formatEventDate(value: string | null) {
  if (!value) return "TBC";
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function priceFrom(types: Array<{ price: number }> | null) {
  if (!types || types.length === 0) return null;
  return Math.min(...types.map((t) => Number(t.price)));
}

const CITIES: Array<{ slug: string; name: string }> = [
  { slug: "london", name: "London" },
  { slug: "manchester", name: "Manchester" },
  { slug: "birmingham", name: "Birmingham" },
  { slug: "bristol", name: "Bristol" },
  { slug: "leeds", name: "Leeds" },
  { slug: "glasgow", name: "Glasgow" },
  { slug: "brighton", name: "Brighton" },
  { slug: "paris", name: "Paris" },
  { slug: "berlin", name: "Berlin" },
  { slug: "amsterdam", name: "Amsterdam" },
  { slug: "barcelona", name: "Barcelona" },
  { slug: "dublin", name: "Dublin" },
  { slug: "new-york", name: "New York" },
  { slug: "los-angeles", name: "Los Angeles" },
  { slug: "miami", name: "Miami" },
  { slug: "chicago", name: "Chicago" },
  { slug: "san-francisco", name: "San Francisco" },
  { slug: "toronto", name: "Toronto" },
  { slug: "vancouver", name: "Vancouver" },
  { slug: "montreal", name: "Montreal" },
  { slug: "calgary", name: "Calgary" },
  { slug: "sydney", name: "Sydney" },
  { slug: "melbourne", name: "Melbourne" },
  { slug: "brisbane", name: "Brisbane" },
  { slug: "perth", name: "Perth" },
];

export default async function HomePage() {
  const supabase = await createServerSupabase();

  const { data: trending } = await supabase
    .from("events")
    .select("id, title, start_date, hero_image, ticket_types, venue_id, organizer_id")
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .order("views", { ascending: false })
    .limit(3);

  const events = (trending || []) as TrendingEvent[];

  // Batch: interest counts + current user status
  const eventIds = events.map((e) => e.id);
  const interestByEvent: Record<string, { interested: number; going: number; mine: "interested" | "going" | null }> = {};
  for (const id of eventIds) {
    interestByEvent[id] = { interested: 0, going: 0, mine: null };
  }

  if (eventIds.length > 0) {
    const { data: allInterest } = await supabase
      .from("event_interest")
      .select("event_id, user_id, status")
      .in("event_id", eventIds);

    for (const row of allInterest || []) {
      const b = interestByEvent[row.event_id];
      if (!b) continue;
      if (row.status === "interested") b.interested++;
      else if (row.status === "going") b.going++;
    }
  }

  // Batch: current user's friendships
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  let currentFriendIds: string[] = [];
  if (currentUser) {
    const { data: friendships } = await supabase
      .from("friendships")
      .select("user_id, friend_id")
      .eq("status", "accepted")
      .or("user_id.eq." + currentUser.id + ",friend_id.eq." + currentUser.id);
    currentFriendIds = (friendships || []).map((f) =>
      f.user_id === currentUser.id ? f.friend_id : f.user_id
    );

    // Set the current user's own status per event
    const { data: myInterest } = await supabase
      .from("event_interest")
      .select("event_id, status")
      .in("event_id", eventIds)
      .eq("user_id", currentUser.id);
    for (const row of myInterest || []) {
      const b = interestByEvent[row.event_id];
      if (b) b.mine = row.status as "interested" | "going";
    }
  }

  // Batch: going users per event (for MiniFriendsGoing friends-first display)
  const goingUsersByEvent: Record<string, Array<{ id: string; name: string; isFriend: boolean }>> = {};
  if (eventIds.length > 0) {
    const { data: goingRows } = await supabase
      .from("event_interest")
      .select("event_id, user_id")
      .in("event_id", eventIds)
      .eq("status", "going");

    const goingUserIds = [...new Set((goingRows || []).map((r) => r.user_id))];
    const profileById: Record<string, string> = {};
    if (goingUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, username")
        .in("id", goingUserIds);
      for (const pr of profiles || []) {
        profileById[pr.id] = pr.full_name || pr.username || "Someone";
      }
    }

    for (const row of goingRows || []) {
      if (!goingUsersByEvent[row.event_id]) goingUsersByEvent[row.event_id] = [];
      goingUsersByEvent[row.event_id].push({
        id: row.user_id,
        name: profileById[row.user_id] || "Someone",
        isFriend: currentFriendIds.includes(row.user_id),
      });
    }
    // Sort: friends first
    for (const id of Object.keys(goingUsersByEvent)) {
      goingUsersByEvent[id].sort((a, b) => Number(b.isFriend) - Number(a.isFriend));
    }
  }

  // Batch: follow counts for the organizers of these events
  const organizerIds = [...new Set(events.map((e) => e.organizer_id).filter(Boolean))] as string[];
  const followerCountByOrganizer: Record<string, number> = {};
  for (const id of organizerIds) followerCountByOrganizer[id] = 0;
  if (organizerIds.length > 0) {
    const { data: followRows } = await supabase
      .from("follows")
      .select("target_id")
      .eq("target_type", "promoter")
      .in("target_id", organizerIds);
    for (const row of followRows || []) {
      if (followerCountByOrganizer[row.target_id] !== undefined) {
        followerCountByOrganizer[row.target_id]++;
      }
    }
  }

  // Friends going this week (event ids)
  const { data: { user } } = await supabase.auth.getUser();
  let friendsGoingIds: string[] = [];
  if (user) {
    const { data: friendships } = await supabase
      .from("friendships")
      .select("user_id, friend_id")
      .eq("status", "accepted")
      .or("user_id.eq." + user.id + ",friend_id.eq." + user.id);

    const friendIds = (friendships || []).map((f) =>
      f.user_id === user.id ? f.friend_id : f.user_id
    );

    if (friendIds.length > 0) {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      const { data: friendGoing } = await supabase
        .from("event_interest")
        .select("event_id")
        .in("user_id", friendIds)
        .eq("status", "going");

      const candidateIds = [...new Set((friendGoing || []).map((r) => r.event_id))];

      if (candidateIds.length > 0) {
        const { data: upcomingFriendEvents } = await supabase
          .from("events")
          .select("id")
          .in("id", candidateIds)
          .eq("status", "published")
          .gte("start_date", new Date().toISOString())
          .lte("start_date", weekFromNow.toISOString());

        friendsGoingIds = (upcomingFriendEvents || []).map((e) => e.id);
      }
    }
  }

  // Fetch event details for friends going
  let friendsGoingEvents: TrendingEvent[] = [];
  if (friendsGoingIds.length > 0) {
    const { data: fg } = await supabase
      .from("events")
      .select("id, title, start_date, hero_image, ticket_types, venue_id")
      .in("id", friendsGoingIds)
      .limit(3);
    friendsGoingEvents = (fg || []) as TrendingEvent[];
  }

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-40">
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Find your
            <br />
            next event.
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-white/80 max-w-2xl">
            Your city. Your scene. Your people.
            <br />
            House, techno, live music, comedy — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/search"
              className="rounded-full bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100"
            >
              Browse events
            </Link>
            <Link
              href="/for-promoters"
              className="rounded-full border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-black"
            >
              For promoters
            </Link>
            <Link
              href="/for-venues"
              className="rounded-full border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-black"
            >
              For venues
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/60">
            No booking fees · Free for promoters and venues
          </p>
        </div>
      </section>

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
      </section>

      {/* TRENDING */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <h2
            className="text-4xl md:text-5xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            What&apos;s hot
          </h2>
          <Link
            href="/search"
            className="text-sm font-medium text-gray-500 hover:text-black"
          >
            See all events →
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-xl border bg-gray-50 p-12 text-center text-gray-500">
            No events yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const from = priceFrom(e.ticket_types);
              return (
                <div
                  key={e.id}
                  className="group overflow-hidden rounded-xl border bg-white transition hover:border-black"
                >
                  <Link
                    href={"/event/" + e.id}
                    className="block"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      {e.hero_image ? (
                        <img
                          src={e.hero_image}
                          alt={e.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="px-5 pt-5">
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
                    </div>
                  </Link>

                  <div className="px-5 pb-5 pt-2">
                    <MiniFriendsGoing
                      eventId={e.id}
                      friends={(goingUsersByEvent[e.id] || [])
                        .filter((u) => u.isFriend)
                        .map((u) => ({ id: u.id, name: u.name }))}
                      totalCount={(interestByEvent[e.id] || { going: 0 }).going}
                    />

                    <div className="mt-3">
                      <MiniInterestButtons
                        eventId={e.id}
                        initialStatus={(interestByEvent[e.id] || { mine: null }).mine}
                        isSignedIn={!!currentUser}
                        initialInterested={(interestByEvent[e.id] || { interested: 0 }).interested}
                        initialGoing={(interestByEvent[e.id] || { going: 0 }).going}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      {e.organizer_id && (
                        <MiniFollowButton
                          targetType="promoter"
                          targetId={e.organizer_id}
                          initialCount={followerCountByOrganizer[e.organizer_id] || 0}
                        />
                      )}
                      <div className="flex items-center gap-1">
                        <ShareButtonMini
                          url={"https://ticketai.org.uk/event/" + e.id}
                          title={e.title}
                        />
                        <Link
                          href={"/event/" + e.id}
                          className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium"
                        >
                          Get Tickets
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* TRENDING NOW — genre tiles */}
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

      {/* CITIES */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2
            className="text-4xl md:text-5xl font-bold uppercase mb-8"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Find events near you
          </h2>
          <div className="flex flex-wrap gap-3">
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={"/" + city.slug}
                className="rounded-full border-2 border-black px-6 py-3 font-medium hover:bg-black hover:text-white"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOVER MORE */}
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

      {/* FOR PROMOTERS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2
          className="text-4xl md:text-6xl font-bold uppercase mb-4 max-w-3xl leading-tight"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          Sell more tickets.
          <br />
          Pay no commission.
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          Free to use. No monthly fee. No per-ticket cut. Keep 100% of what your
          fans pay.
        </p>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div>
            <p
              className="text-3xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              £0 commission
            </p>
            <p className="mt-3 text-gray-700">
              Other platforms take 3.5% + 49p per ticket. We take £0.
            </p>
          </div>
          <div>
            <p
              className="text-3xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Know what works
            </p>
            <p className="mt-3 text-gray-700">
              Built-in click tracking, conversion attribution, and channel
              analytics.
            </p>
          </div>
          <div>
            <p
              className="text-3xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Get paid fast
            </p>
            <p className="mt-3 text-gray-700">
              Money in your account 3 days after your event, not 30.
            </p>
          </div>
        </div>

        <Link
          href="/for-promoters"
          className="inline-block rounded-full bg-black text-white px-8 py-4 font-semibold hover:bg-gray-800"
        >
          Start selling — it&apos;s free
        </Link>
      </section>

      {/* FOR VENUES */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2
            className="text-4xl md:text-6xl font-bold uppercase mb-4 max-w-3xl leading-tight"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Fill your calendar.
            <br />
            Earn on every ticket.
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl">
            Free to list. Get discovered by promoters. Earn a share of every
            ticket sold at your venue.
          </p>

          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div>
              <p
                className="text-3xl font-bold uppercase"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Free forever
              </p>
              <p className="mt-3 text-gray-700">
                No listing fee. No monthly subscription. No 12-month contract.
              </p>
            </div>
            <div>
              <p
                className="text-3xl font-bold uppercase"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Get discovered
              </p>
              <p className="mt-3 text-gray-700">
                Promoters browse and message you directly. No middlemen.
              </p>
            </div>
            <div>
              <p
                className="text-3xl font-bold uppercase"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Real numbers
              </p>
              <p className="mt-3 text-gray-700">
                Occupancy, revenue share, repeat bookings — in real time.
              </p>
            </div>
          </div>

          <Link
            href="/for-venues"
            className="inline-block rounded-full bg-black text-white px-8 py-4 font-semibold hover:bg-gray-800"
          >
            List your venue — free
          </Link>
        </div>
      </section>

      {/* AI BUILDER */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
              🤖 AI Campaign Builder
            </p>
            <h2
              className="text-4xl md:text-6xl font-bold uppercase leading-tight"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Tell us your goal.
              <br />
              We&apos;ll design the campaign.
            </h2>
            <p className="mt-6 text-lg text-white/80 max-w-2xl">
              Audience, budget, channels, ad concepts, captions — the lot.
              Powered by Google Gemini. No other ticketing platform does this.
            </p>
            <Link
              href="/for-promoters"
              className="mt-10 inline-block rounded-full bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2
          className="text-4xl md:text-5xl font-bold uppercase mb-12"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          How it works
        </h2>
        <div className="grid gap-10 md:grid-cols-4">
          {[
            { n: "1", t: "Find an event", d: "Browse by city, genre, or date." },
            { n: "2", t: "Get tickets", d: "Pay securely. No hidden fees." },
            { n: "3", t: "Show QR at door", d: "Scan in at the entrance." },
            { n: "4", t: "Enjoy", d: "That's it. Go have a good night." },
          ].map((s) => (
            <div key={s.n}>
              <p
                className="text-5xl font-bold text-gray-300"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                {s.n}
              </p>
              <p className="mt-4 text-xl font-semibold">{s.t}</p>
              <p className="mt-2 text-gray-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#00FF87]">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2
            className="text-5xl md:text-7xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Ready to go out?
          </h2>
          <Link
            href="/search"
            className="mt-10 inline-block rounded-full bg-black text-white px-10 py-5 text-lg font-semibold hover:bg-gray-800"
          >
            Browse events
          </Link>
        </div>
      </section>
    </main>
  );
}