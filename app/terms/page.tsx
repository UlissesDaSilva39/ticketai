export const metadata = {
  title: "Terms of Service — TicketAI",
  description: "Terms governing your use of TicketAI.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>
        TERMS OF SERVICE
      </h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: 25 September 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">1. Who We Are</h2>
          <p>
            TicketAI (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates an AI-powered event discovery
            and ticketing platform at ticketai.org.uk. These Terms of Service (&quot;Terms&quot;)
            govern your use of the platform.</p></section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">2. Accepting the Terms</h2>
          <p>
            By creating an account or purchasing a ticket, you agree to these Terms. If you do
            not agree, you must not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">3. Accounts</h2>
          <p>
            You are responsible for keeping your account credentials secure. You must be at
            least 18 years old, or have permission from a parent or guardian, to create an
            account and purchase tickets.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">4. Buying Tickets</h2>
          <p>
            When you purchase a ticket, you enter into a contract with the event organizer,
            not with TicketAI. TicketAI acts as an intermediary and payment agent.
          </p>
          <p>
            Ticket prices are set by the organizer. We charge a platform fee of 2% plus payment
            processing fees, which are shown at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">5. Refunds</h2>
          <p>
            Refunds are governed by our Refund Policy, which forms part of these Terms.
            In summary, refunds are available if an event is cancelled or materially changed,
            and at the discretion of the organizer in other cases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">6. Organizer Responsibilities</h2>
          <p>
            If you create events on TicketAI, you agree that:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You have the right to sell tickets for the events you list.</li>
            <li>Event information you provide is accurate.</li>
            <li>You will honour tickets sold through the platform.</li>
            <li>You will comply with all applicable laws and regulations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">7. Promoter Programme</h2>
          <p>
            Promoters may earn commission by sharing referral links. Commissions are tracked
            by the platform. Payouts are made manually until automated payouts are enabled.
            We reserve the right to reverse commissions for fraudulent or refunded orders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">8. Venue Revenue Share</h2>
          <p>
            Where an event is hosted at a registered venue, the venue may earn a percentage of
            ticket sales as set by the organizer. This is tracked by the platform and forms part
            of the money flow at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">9. Prohibited Uses</h2>
          <p>You may not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the platform for fraudulent or illegal purposes.</li>
            <li>Attempt to resell tickets in violation of the organizer&apos;s rules.</li>
            <li>Interfere with the platform&apos;s operation or security.</li>
            <li>Copy, scrape, or reverse engineer the platform.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">10. Our Liability</h2>
          <p>
            TicketAI provides the platform &quot;as is&quot;. We are not liable for events that are
            cancelled, postponed, or changed by the organizer. Our liability for any claim is
            limited to the platform fee you paid.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be notified by
            email or in-app. Continued use of the platform means you accept the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of England and Wales. Disputes will be handled
            in the courts of England and Wales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">13. Contact</h2>
          <p>
            For questions about these Terms, email{" "}
            <a href="mailto:legal@ticketai.org.uk" className="text-black underline">
              legal@ticketai.org.uk
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
