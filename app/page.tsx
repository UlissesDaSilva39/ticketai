 import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TicketAI — Find your next event",
  description:
    "Discover house, techno, live music, and comedy events near you. No booking fees. Free for promoters.",
};

type TrendingEvent = {
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

const CITIES = [
  "London",
  "Manchester",
  "Birmingham",
  "Bristol",
  "Leeds",
  "Glasgow",
  "Brighton",
];

export default async function HomePage() {
  const supabase = await createServerSupabase();

  const { data: trending } = await supabase
    .from("events")
    .select("id, title, start_date, hero_image, ticket_types, venue_id")
    .eq("status", "published")
    .gte("start_date", new Date().toISOString())
    .order("views", { ascending: false })
    .limit(3);

  const events = (trending || []) as TrendingEvent[];

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
                <Link
                  key={e.id}
                  href={"/event/" + e.id}
                  className="group block overflow-hidden rounded-xl border bg-white transition hover:border-black"
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
                  <div className="p-5">
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
              );
            })}
          </div>
        )}
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
                key={city}
                href={"/search?q=" + encodeURIComponent(city)}
                className="rounded-full border-2 border-black px-6 py-3 font-medium hover:bg-black hover:text-white"
              >
                {city}
              </Link>
            ))}
          </div>
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