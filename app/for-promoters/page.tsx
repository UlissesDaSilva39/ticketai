import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell tickets free — no commission | TicketAI",
  description:
    "Free to use. No monthly fee. No per-ticket commission. Keep 100% of what your fans pay. Built-in campaign tracking and 3-day payouts.",
};

export default function ForPromotersPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            For promoters
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold leading-none uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Sell more tickets.
            <br />
            Pay no commission.
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-2xl">
            Free to use. No monthly fee. No per-ticket cut. Keep 100% of what
            your fans pay.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/promoters/join"
              className="rounded-full bg-black text-white px-8 py-4 font-medium hover:bg-gray-800"
            >
              Start selling — it&apos;s free
            </Link>
            <a
              href="#compare"
              className="rounded-full border border-gray-300 px-8 py-4 font-medium hover:border-black"
            >
              See the comparison
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card. No setup. Takes 5 minutes.
          </p>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-14 grid gap-8 md:grid-cols-3">
          <div>
            <p
              className="text-3xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              £0 commission
            </p>
            <p className="mt-3 text-gray-700">
              Other platforms take 3.5% + 49p per ticket. We take £0. You pay
              only the Stripe processing fee that any payment processor charges.
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
              analytics. See exactly which Instagram post or email sold your
              tickets.
            </p>
          </div>
          <div>
            <p
              className="text-3xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Get paid in 3 days
            </p>
            <p className="mt-3 text-gray-700">
              Money in your account 3 days after your event, not 30. No waiting
              around for payouts that should have been yours already.
            </p>
          </div>
        </div>
      </section>

      <section id="compare" className="max-w-6xl mx-auto px-6 py-20">
        <h2
          className="text-4xl md:text-5xl font-bold uppercase mb-10"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          How we compare
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-black text-left">
                <th className="py-3 pr-4 font-medium"></th>
                <th className="py-3 px-4 font-medium">Eventbrite</th>
                <th className="py-3 px-4 font-medium">Dice</th>
                <th className="py-3 px-4 font-medium bg-black text-white">
                  TicketAI
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Listing fee", "£0", "£0", "£0"],
                ["Per-ticket commission", "3.5% + 49p", "~5%", "£0"],
                ["Payout delay", "5–30 days", "5 days", "3 days"],
                ["Built-in campaign tracking", "No", "No", "Yes"],
                ["Click & conversion attribution", "No", "No", "Yes"],
                ["AI campaign builder", "No", "No", "Coming"],
                ["Free to start", "Yes", "Yes", "Yes"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 pr-4 text-gray-600">{row[0]}</td>
                  <td className="py-3 px-4">{row[1]}</td>
                  <td className="py-3 px-4">{row[2]}</td>
                  <td className="py-3 px-4 font-medium bg-gray-50">
                    {row[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2
            className="text-4xl md:text-5xl font-bold uppercase mb-12"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            How it works
          </h2>
          <div className="grid gap-10 md:grid-cols-4">
            {[
              {
                n: "1",
                t: "Create your event",
                d: "Title, date, venue, ticket types. Takes 5 minutes.",
              },
              {
                n: "2",
                t: "Share your link",
                d: "One unique URL. Post it anywhere — Instagram, email, WhatsApp.",
              },
              {
                n: "3",
                t: "Track every sale",
                d: "Real-time dashboard: clicks, conversions, revenue, channel performance.",
              },
              {
                n: "4",
                t: "Get paid",
                d: "Money in your account 3 days after your event.",
              },
            ].map((step) => (
              <div key={step.n}>
                <p
                  className="text-5xl font-bold text-gray-300"
                  style={{ fontFamily: "var(--font-antonio)" }}
                >
                  {step.n}
                </p>
                <p className="mt-4 text-xl font-semibold">{step.t}</p>
                <p className="mt-2 text-gray-600">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2
          className="text-4xl md:text-5xl font-bold uppercase mb-4"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          Optional extras
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl">
          You only pay if you want them. Core ticketing stays free forever.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              t: "Featured placement",
              p: "from £19/day",
              d: "Pin your event to the top of search results in your city.",
            },
            {
              t: "Push to your followers",
              p: "from £9 per blast",
              d: "Notify everyone who follows you on TicketAI.",
            },
            {
              t: "AI Campaign Builder",
              p: "coming soon",
              d: "Describe your goal. AI writes your audience, budget, ads, and captions.",
            },
            {
              t: "Custom branding",
              p: "contact us",
              d: "Your logo, your colours, your domain on every ticket.",
            },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-gray-200 p-6">
              <p className="font-semibold">{x.t}</p>
              <p className="text-sm text-gray-500 mt-1">{x.p}</p>
              <p className="mt-3 text-gray-700 text-sm">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2
            className="text-5xl md:text-7xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Ready to sell?
          </h2>
          <p className="mt-6 text-lg text-white/80">
            Create your first event in 5 minutes. Keep every penny.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="/promoters/join"
              className="rounded-full bg-white text-black px-8 py-4 font-medium hover:bg-gray-100"
            >
              Create your first event — free
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/60">
            Questions? <span className="underline">hello@ticketai.app</span>
          </p>
        </div>
      </section>
    </main>
  );
}