import Link from 'next/link'

export function RoyaltyRegistrationCTA() {
  return (
    <div className="bg-gradient-to-br from-green-500 to-green-700 dark:from-green-700 dark:to-green-900 rounded-2xl p-8 md:p-12 text-center text-white">
      <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-4">FREE TO START</div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Stop leaving money on the table.</h2>
      <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
        The average independent artist leaves £340 a year unclaimed because a work was never registered.
        Connect your sources, assign splits, and get paid what you are owed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/royalties/register" className="px-8 py-3 rounded-full text-sm font-bold bg-white text-green-700 hover:bg-gray-100 transition-colors">Create free account</Link>
        <Link href="/royalties/register?tier=pro" className="px-8 py-3 rounded-full text-sm font-bold bg-black text-white hover:bg-gray-900 transition-colors">Start Pro - £9/month</Link>
      </div>
      <p className="text-xs opacity-75 mt-4">No credit card required for free tier. Pro adds automatic statement ingestion and multi-currency payouts.</p>
    </div>
  )
}
