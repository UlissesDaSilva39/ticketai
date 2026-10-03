import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List your venue free â get discovered | TicketAI",
  description:
    "Free to list. Get booked by promoters. Earn a share of every ticket sold at your venue. No monthly fee. No 12-month contract.",
};

export default function ForVenuesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">
            For venues
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold leading-none uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            List your venue.
            <br />
            Get discovered.
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-2xl">
            Free to list. Get booked by promoters. Earn a share of every ticket
            sold at your venue.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/venues/join"
              className="rounded-full bg-black text-white px-8 py-4 font-medium hover:bg-gray-800"
            >
              List your venue â free
            </Link>
            <a
              href="#compare"
              className="rounded-full border border-gray-300 px-8 py-4 font-medium hover:border-black"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No contract. No monthly fee. Live in 5 minutes.
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
              Free forever
            </p>
            <p className="mt-3 text-gray-700">
              No listing fee. No monthly subscription. No 12-month contract.
              List your venue and start getting inquiries.
            </p>
          </div>
          <div>
            <p
              className="text-3xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              Earn on every ticket
            </p>
            <p className="mt-3 text-gray-700">
              You get a share of every ticket sold for events at your venue.
              Paid out 3 days after the event, not 30.
            </p>
          </div>
          <div>
            <p
              className="text-3xl font-bold uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              See real numbers
            </p>
            <p className="mt-3 text-gray-700">
              Occupancy, average ticket price, repeat bookings. Analytics
              venues have never had â in real time.
            </p>
          </div>
        </div>
      </section>

      <section id="compare" className="max-w-6xl mx-auto px-6 py-20">
        <h2
          className="text-4xl md:text-5xl font-bold uppercase mb-10"
          style={{ fontFamily: "var(--font-antonio)" }}
        >
          What you actually get
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-black text-left">
                <th className="py-3 pr-4 font-medium"></th>
                <th className="py-3 px-4 font-medium">Most venue platforms</th>
                <th className="py-3 px-4 font-medium bg-black text-white">
                  TicketAI
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Listing fee", "£100+ / month", "£0"],
                ["Contract", "12 months", "None"],
                ["Revenue share", "Platform keeps it", "You earn it"],
                ["Direct promoter contact", "No", "Yes"],
                ["Real-time analytics", "No", "Yes"],
                ["Payout time", "30+ days", "3 days"],
                ["Cancel anytime", "No", "Yes"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 pr-4 text-gray-600">{row[0]}</td>
                  <td className="py-3 px-4">{row[1]}</td>
                  <td className="py-3 px-4 font-medium bg-gray-50">
                    {row[2]}
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
                t: "List your venue",
                d: "Name, address, capacity, photos. Takes 5 minutes.",
              },
              {
                n: "2",
                t: "Get discovered",
                d: "Promoters browse and message you directly. No middlemen.",
              },
              {
                n: "3",
                t: "Host the event",
                d: "We handle tickets, payments, check-in. You run the show.",
              },
              {
                n: "4",
                t: "Get paid",
                d: "Your revenue share, 3 days after the event.",
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

      <section className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2
            className="text-5xl md:text-7xl font-bold uppercase"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            Ready to fill your calendar?
          </h2>
          <p className="mt-6 text-lg text-white/80">
            List your venue free. Start getting inquiries this week.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="/venues/join"
              className="rounded-full bg-white text-black px-8 py-4 font-medium hover:bg-gray-100"
            >
              List your venue â free
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