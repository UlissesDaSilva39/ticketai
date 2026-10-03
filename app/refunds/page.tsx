export const metadata = {
  title: "Refund Policy — TicketAI",
  description: "How refunds work on TicketAI.",
};

export default function RefundsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>
        REFUND POLICY
      </h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: 25 September 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">1. Overview</h2>
          <p>
            This policy explains when you can get a refund for a ticket purchased on TicketAI.
            The event organizer is responsible for the event. TicketAI processes refunds on
            their behalf.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">2. When You Are Entitled to a Refund</h2>
          <p>You are entitled to a full refund if:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>The event is cancelled and not rescheduled.</li>
            <li>The event is postponed and you cannot attend the new date.</li>
            <li>The event is materially changed (e.g., headline act replaced).</li>
            <li>You were charged twice for the same order.</li>
            <li>Your payment was made fraudulently.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">3. When You Are Not Entitled to a Refund</h2>
          <p>Refunds are typically not available if:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You simply change your mind.</li>
            <li>You cannot attend for personal reasons.</li>
            <li>You arrive late and are refused entry.</li>
            <li>You are removed from the event for breaching venue rules.</li>
            <li>The event goes ahead as planned.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">4. Cancelled Events</h2>
          <p>
            If an event is cancelled, you will be refunded the full ticket price including all
            fees. Refunds are processed automatically within 14 days of the cancellation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">5. Postponed Events</h2>
          <p>
            If an event is postponed, your ticket remains valid for the new date. If you cannot
            attend the new date, you may request a refund within 14 days of the new date being
            announced.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">6. How to Request a Refund</h2>
          <p>To request a refund:</p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Email{" "}
              <a href="mailto:refunds@ticketai.org.uk" className="text-black underline">
                refunds@ticketai.org.uk
              </a>
            </li>
            <li>Include your order reference and the reason for the request.</li>
            <li>Allow up to 14 days for a response and processing.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">7. Refund Method</h2>
          <p>
            Refunds are issued to the original payment method. Depending on your bank, refunds
            may take 5–10 business days to appear on your statement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">8. Fees</h2>
          <p>
            Processing fees are refunded when an event is cancelled. In other cases, the
            original processing fee may be retained to cover the cost of the transaction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">9. Chargebacks</h2>
          <p>
            If you raise a chargeback with your bank, we may suspend your account pending
            investigation. Please contact us first — we can usually resolve issues faster than
            the chargeback process.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">10. Your Statutory Rights</h2>
          <p>
            This policy does not affect your statutory rights under the Consumer Rights Act 2015
            or other applicable UK law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">11. Contact</h2>
          <p>
            Refund requests:{" "}
            <a href="mailto:refunds@ticketai.org.uk" className="text-black underline">
              refunds@ticketai.org.uk
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
