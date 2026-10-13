import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund policy",
  description: "How refunds work on GRID.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-gray-500 hover:text-black mb-8 inline-block">
          &larr; Back to home
        </Link>

        <h1 className="text-4xl font-bold uppercase mb-8" style={{ fontFamily: "var(--font-antonio)" }}>
          Refund policy
        </h1>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500">Last updated: 13 October 2026</p>

          <section>
            <h2 className="text-xl font-bold mb-2">1. Overview</h2>
            <p>
              This policy explains when and how ticket purchases made through GRID can be refunded.
              Refund eligibility depends on the event organiser, the event status, and the time
              remaining before the event starts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">2. Standard refund window</h2>
            <p>
              Unless the event page states otherwise, you may request a full refund up to 48 hours
              before the event start time. Requests made less than 48 hours before the event will
              be reviewed by the organiser on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">3. Cancelled or postponed events</h2>
            <p>
              If an event is cancelled, all ticket holders receive a full refund automatically. If
              an event is postponed, you may either retain your ticket for the new date or request
              a refund within 14 days of the announcement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">4. Non-refundable items</h2>
            <p>
              Booking fees, transaction fees, and optional add-ons are non-refundable unless
              required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">5. How to request a refund</h2>
            <p>
              Open your ticket in <Link href="/my-tickets" className="underline hover:text-black">My Tickets</Link>{" "}
              and select &ldquo;Request refund&rdquo;. If the event is within the refund window, the request
              will be submitted to the organiser for approval. You will be notified by email once a
              decision has been made.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">6. Refund timing</h2>
            <p>
              Approved refunds are processed to the original payment method within 5–10 business days.
              Bank processing times may vary.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2">7. Contact</h2>
            <p>
              For refund questions not covered here, please{" "}
              <Link href="/contact" className="underline hover:text-black">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
