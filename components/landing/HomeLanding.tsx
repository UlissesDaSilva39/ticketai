import Link from "next/link";
import RoleTabs from "./RoleTabs";

const STEPS = [
  {
    n: 1,
    title: "Discover",
    body: "Find collabs, gigs and artists matched to your genre, city and skills.",
  },
  {
    n: 2,
    title: "Collaborate",
    body: "Chat, share tracks and agree split sheets, all in one place.",
  },
  {
    n: 3,
    title: "Get paid",
    body: "Payments are held in escrow and released when the work is delivered.",
  },
];

const FEATURES = [
  { title: "Escrow payments", body: "The client pays up front. You get paid on delivery. No chasing invoices." },
  { title: "Split sheets", body: "Agree who owns what before release, signed by everyone on the track." },
  { title: "Verified profiles", body: "Verified badges show you who is real before you send a single file." },
  { title: "EPK in minutes", body: "One link with your music, press, rider and booking button." },
];

/**
 * Real testimonials only: each one must come from a real user who agreed to
 * be quoted. UK law (DMCC Act 2024) bans fake or invented reviews.
 * The section stays hidden while this list is empty.
 */
const TESTIMONIALS: { quote: string; name: string; role: string }[] = [];

export default function HomeLanding() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-28 md:pb-28 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-purple-600 dark:text-purple-400 mb-5">
          The music industry network
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
          Get booked.
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Get paid.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          One platform for artists, producers and venues. Find collabs, book gigs and get paid through secure escrow.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
          >
            Join free
          </Link>
          <Link
            href="/artists/ulisses-silva"
            className="px-8 py-4 rounded-full font-semibold border border-gray-300 dark:border-gray-700 hover:border-gray-500"
          >
            See an example EPK
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">Free to start. No credit card needed.</p>
      </section>

      {/* Who is it for */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">Who is GRID for?</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
            One platform for the whole music ecosystem.
          </p>
          <RoleTabs />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">How it works</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Three steps to your next gig.</p>
          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 font-bold mb-4">
                  {s.n}
                </span>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why GRID */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Built for how music gets made</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials: only renders when real quotes exist */}
      {TESTIMONIALS.length > 0 && (
        <section className="border-t border-gray-200 dark:border-gray-800 py-20 bg-white dark:bg-gray-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What members say</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <blockquote className="text-gray-800 dark:text-gray-200 mb-4">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="text-sm">
                    <span className="font-bold">{t.name}</span>
                    <span className="text-gray-500"> · {t.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="border-t border-gray-200 dark:border-gray-800 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get paid?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Free to start. Upgrade to GRID Pro when you want priority in matches and unlimited gig applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
            >
              Create free account
            </Link>
            <Link
              href="/pro"
              className="px-8 py-4 rounded-full font-semibold border border-gray-300 dark:border-gray-700 hover:border-gray-500"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
