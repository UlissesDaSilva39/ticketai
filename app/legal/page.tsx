import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen py-12 px-4">
      <div className="max-w-[800px] mx-auto bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">GRID Corporation Legal Center</h1>
        <p className="text-gray-500 mb-8">Last updated: November 2026</p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section id="terms" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Terms of Service</h2>
            <p className="mb-2">By using GRID, you agree to these terms. GRID is a music social network and escrow platform connecting artists, producers, venues, and curators.</p>
            <p className="mb-2"><strong>Escrow & Fees:</strong> GRID charges a 5% platform fee on all escrow transactions. We hold funds securely until the buyer releases them to the seller. We also charge a 10% fee on Marketplace sales.</p>
            <p><strong>Disputes:</strong> If a project is disputed, GRID Support acts as a mediator. Our decision is final.</p>
          </section>
          <section id="privacy" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Privacy Policy</h2>
            <p className="mb-2">We respect your privacy. Your personal data (Name, Email, Location) is used to connect you with other industry professionals.</p>
            <p><strong>Payments:</strong> All financial data is handled securely by Stripe. GRID does not store your credit card information.</p>
          </section>
          <section id="curators" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Curator Verification Policy</h2>
            <p>To protect artists from scams, all Playlist Curators, Bloggers, and Radio Producers must be verified by GRID Admin before they can accept Pitch Credits. Fake or misleading profiles will be permanently banned.</p>
          </section>
          <section id="cookies" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Cookie Policy & Ad Choices</h2>
            <p>We use cookies to keep you logged in and to serve relevant music advertisements. You can manage your ad preferences in your Account Settings.</p>
          </section>
          <section id="copyright" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Copyright & DMCA</h2>
            <p>If you believe your music has been uploaded without permission, please contact our legal team at <a href="mailto:hello@grid.app" className="font-semibold underline">hello@grid.app</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap gap-4 text-sm font-semibold text-emerald-600">
          <Link href="/" className="hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}