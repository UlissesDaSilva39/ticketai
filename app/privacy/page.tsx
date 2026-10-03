export const metadata = {
  title: "Privacy Policy — TicketAI",
  description: "How TicketAI collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>
        PRIVACY POLICY
      </h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: 25 September 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">1. Introduction</h2>
          <p>
            TicketAI (&quot;we&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy
            explains what data we collect, how we use it, and your rights under the UK GDPR and
            the Data Protection Act 2018.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">2. Data We Collect</h2>
          <p>We collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account data:</strong> email address, name, password (hashed).</li>
            <li><strong>Purchase data:</strong> tickets purchased, order history, amount paid.</li>
            <li><strong>Event data:</strong> events you create, promote, or attend.</li>
            <li><strong>Payment data:</strong> processed by our payment providers — we do not store card details.</li>
            <li><strong>Usage data:</strong> pages visited, device information, IP address.</li>
            <li><strong>Referral data:</strong> referral codes used to attribute promoter commissions.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">3. How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process ticket purchases and deliver tickets to you.</li>
            <li>Send transactional emails (confirmations, tickets, password resets).</li>
            <li>Calculate and pay promoter commissions and venue revenue shares.</li>
            <li>Improve event recommendations and platform functionality.</li>
            <li>Prevent fraud and comply with legal obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">4. Legal Basis</h2>
          <p>
            We process your data on the basis of contract (to deliver tickets), legitimate
            interest (to improve the platform), legal obligation (fraud prevention, tax), and
            consent (marketing emails — you may unsubscribe at any time).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">5. Sharing Your Data</h2>
          <p>We share data with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Event organizers:</strong> the name on your ticket is shared so they can check you in.</li>
            <li><strong>Payment providers:</strong> to process payments securely.</li>
            <li><strong>Email providers:</strong> to send transactional emails.</li>
            <li><strong>AI providers:</strong> when you use AI features, anonymised data may be sent to generate captions or recommendations.</li>
            <li><strong>Analytics providers:</strong> to understand platform usage.</li>
          </ul>
          <p>We never sell your personal data.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">6. Cookies</h2>
          <p>
            We use cookies to keep you signed in, remember referral codes, and improve your
            experience. You can disable cookies in your browser settings, but some features may
            not work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">7. Retention</h2>
          <p>
            We retain account and purchase data for as long as required for tax and legal
            purposes (typically 6 years in the UK). You may request deletion of your account at
            any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">8. Your Rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access the data we hold about you.</li>
            <li>Correct inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Object to certain processing.</li>
            <li>Request data portability.</li>
            <li>Lodge a complaint with the ICO (ico.org.uk).</li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href="mailto:privacy@ticketai.org.uk" className="text-black underline">
              privacy@ticketai.org.uk
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">9. Security</h2>
          <p>
            We use industry-standard security measures including encryption in transit, hashed
            passwords, and access controls. No system is completely secure — please use a strong,
            unique password.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">10. Children</h2>
          <p>
            Our platform is not intended for children under 13. If you are under 18, please use
            the platform with the consent of a parent or guardian.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">11. Changes</h2>
          <p>
            We may update this policy from time to time. We will notify you of material changes
            by email.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-black">12. Contact</h2>
          <p>
            Data protection queries:{" "}
            <a href="mailto:privacy@ticketai.org.uk" className="text-black underline">
              privacy@ticketai.org.uk
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
