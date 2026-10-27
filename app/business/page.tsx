import Link from "next/link";
import { BusinessCard } from "@/components/business/BusinessCard";

export default function BusinessPage() {
  const dashboards = [
    {
      title: "Organiser",
      description: "List events. Track clicks. Keep 100% of ticket revenue.",
      href: "/organizer",
      accent: "from-purple-600 to-pink-600",
    },
    {
      title: "Promoter",
      description: "See who's clicking. Build your audience. No platform fees.",
      href: "/promoter/dashboard",
      accent: "from-blue-600 to-cyan-500",
    },
    {
      title: "Venue",
      description: "Claim your venue. Get discovered. Fill your room.",
      href: "/venue/dashboard",
      accent: "from-amber-500 to-orange-600",
    },
    {
      title: "Artist",
      description: "Get booked. Share your EPK. Connect with promoters.",
      href: "/artist/dashboard",
      accent: "from-emerald-500 to-teal-600",
    },
    {
      title: "Label",
      description: "Manage your roster. Track artist reach.",
      href: "/label/dashboard",
      accent: "from-rose-500 to-red-600",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      
      {/* HERO SECTION - The Hook */}
      <header className="mb-12 text-center md:mb-16">
        <p className="text-xs font-bold uppercase tracking-widest text-purple-600 sm:text-sm">
          GRID for Business
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
          Keep your ticket revenue.<br className="hidden sm:block" /> Own your audience.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg">
          GRID connects your listings to a network of music fans, artists, and industry professionals. 
          We don't sell tickets. We take no commission on outbound ticket links.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/organizer/events/new"
            className="rounded-full bg-neutral-900 px-8 py-3 text-center text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            List an Event
          </Link>
          <Link
            href="/organizer"
            className="rounded-full border border-neutral-300 px-8 py-3 text-center text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            Claim Your Profile
          </Link>
        </div>
      </header>

      {/* VALUE PROPOSITION - Why GRID? */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-neutral-900">Why list on GRID?</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-neutral-50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-neutral-900">Keep 100% of Revenue</h3>
            <p className="mt-2 text-sm text-neutral-600">
              No booking fees. No commission on outbound ticket links. We link to your existing ticket page so you keep what you earn.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-neutral-900">Own Your Audience</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Unlike Ticketmaster, we don't hide the buyer from you. Build a direct relationship with your fans.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-neutral-900">Real Insights</h3>
            <p className="mt-2 text-sm text-neutral-600">
              See how many fans viewed your event this week. Data you can actually use to sell more tickets.
            </p>
          </div>
        </div>
      </section>

      {/* DASHBOARD GRID */}
      <section className="mb-12">
        <h2 className="mb-2 text-center text-2xl font-bold text-neutral-900">Your tools</h2>
        <p className="mb-6 text-center text-sm text-neutral-500">Choose the dashboard that matches your role. Your profile and audience are shared across all of them.</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 items-stretch">
          {dashboards.map((d) => (
            <BusinessCard
              key={d.href}
              title={d.title}
              description={d.description}
              href={d.href}
              accent={d.accent}
            />
          ))}
        </div>
      </section>

      {/* POSITIONING / PROOF */}
      <section className="mb-6 rounded-2xl bg-neutral-900 p-6 text-center text-white sm:p-8">
        <p className="text-base font-semibold sm:text-lg">
          Built for the 50–12,000 capacity world.
        </p>
        <p className="mt-2 text-sm text-neutral-300">
          GRID is free to list. Core dashboards are free forever. Advanced insights and featured placement are paid add-ons. Your audience is yours.
        </p>
      </section>
      <p className="mb-10 text-center text-sm text-neutral-500">
        Launching with early access for UK promoters and venues.{" "}
        <a href="mailto:hello@grid.org.uk?subject=Early access" className="font-semibold text-neutral-900 underline">
          Join the waitlist &rarr;
        </a>
      </p>

      {/* SECONDARY CTA */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-neutral-900">Not listed yet?</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Claim a profile or list your first event. It is free to start.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/discover"
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Explore GRID
          </Link>
          <Link
            href="/artist/register"
            className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            Register as artist
          </Link>
          <Link
            href="/promoter/register"
            className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
          >
            Register as promoter
          </Link>
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-neutral-500">GRID — the network for live music.  Event data via Ticketmaster Developer API, used under permitted terms.</p>
    </main>
  );
}