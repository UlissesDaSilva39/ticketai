import Link from 'next/link'

export const metadata = {
  title: 'Create your royalty account | GRID',
  description: 'Track every penny you earn across all your music sources. Free to start.',
}

export default function RoyaltyRegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/royalties" className="text-sm text-gray-500 dark:text-gray-400 hover:underline mb-6 inline-block">Back to Royalties</Link>
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-3">Free to start</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">Know what you are owed.</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Connect your distributor, publisher, and PRO. GRID pulls every statement into one dashboard and shows you exactly what is pending, paid, and unclaimed.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <p className="text-3xl mb-3">£</p>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">See every penny</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Spotify, Apple Music, TikTok, PRS, Bandcamp - all in one statement view.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <p className="text-3xl mb-3">%</p>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">Split automatically</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Assign percentages once. GRID pays every collaborator correctly, every time.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <p className="text-3xl mb-3">!</p>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">Never miss unclaimed money</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">GRID flags tracks with earnings but no registration - before the period closes.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Create your account</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your name</label>
              <input type="text" placeholder="DJ Poxy" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input type="password" placeholder="At least 8 characters" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button type="button" className="px-4 py-3 rounded-lg text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Free</button>
              <button type="button" className="px-4 py-3 rounded-lg text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors">Pro - £9/mo</button>
            </div>
            <button type="submit" className="w-full px-4 py-3 rounded-lg text-sm font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors mt-2">Create free account</button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">By signing up you agree to GRID's <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
          </form>
        </div>
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Trusted by independent artists across the UK and Europe</p>
          <div className="flex items-center justify-center gap-8 opacity-60 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-gray-100">DJ Poxy</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Paper Lions</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Basement Collective</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Analog Dreams</span>
          </div>
        </div>
      </div>
    </main>
  )
}
