import Link from 'next/link'
import { RoyaltySnapshot } from '@/components/royalties/RoyaltySnapshot'
import { RoyaltySplits } from '@/components/royalties/RoyaltySplits'
import { RoyaltyStatements } from '@/components/royalties/RoyaltyStatements'
import { RoyaltyPayouts } from '@/components/royalties/RoyaltyPayouts'
import { RoyaltyRegistrationCTA } from '@/components/royalties/RoyaltyRegistrationCTA'

export const metadata = {
  title: 'Royalty Management | GRID',
  description: 'Know what you are owed. Get paid on time. Royalty tracking, splits, and payouts for music artists.',
}

export default function RoyaltiesPage() {
  const snapshot = { thisMonth: 124000, pending: 38400, paidYtd: 892000, unclaimed: 34000 }
  const splits = [
    { id: '1', track_title: 'Late Night Drive', artist_name: 'DJ Poxy', status: 'assigned' as const, collaborators: ['Alex Rivera (producer)', 'Kim Tanaka (vocal)'], earnedThisMonth: 42000 },
    { id: '2', track_title: 'Paper Planes', artist_name: 'Paper Lions', status: 'missing' as const, collaborators: [], earnedThisMonth: 38000 },
    { id: '3', track_title: 'Basement Nights', artist_name: 'Basement Collective', status: 'partial' as const, collaborators: ['Marco Silva (writer)'], earnedThisMonth: 26000 },
    { id: '4', track_title: 'Analog Dreams', artist_name: 'Analog Dreams', status: 'assigned' as const, collaborators: ['Nina Park (producer)'], earnedThisMonth: 18000 },
  ]
  const statements = [
    { id: '1', source: 'Spotify (via distributor)', period: 'Oct 2026', gross: 124000, fees: 12400, net: 111600, status: 'matched' as const },
    { id: '2', source: 'Apple Music', period: 'Oct 2026', gross: 38000, fees: 3800, net: 34200, status: 'matched' as const },
    { id: '3', source: 'TikTok (UGC)', period: 'Q3 2026', gross: 9500, fees: 950, net: 8550, status: 'unmatched' as const },
    { id: '4', source: 'PRS (publishing)', period: 'Sep 2026', gross: 42000, fees: 0, net: 42000, status: 'matched' as const },
    { id: '5', source: 'Bandcamp', period: 'Oct 2026', gross: 12000, fees: 1200, net: 10800, status: 'pending' as const },
  ]
  const payouts = [
    { id: '1', date: '15 Oct 2026', amount: 89000, method: 'Bank transfer', status: 'paid' as const },
    { id: '2', date: '15 Sep 2026', amount: 74000, method: 'Bank transfer', status: 'paid' as const },
    { id: '3', date: '15 Aug 2026', amount: 61000, method: 'PayPal', status: 'paid' as const },
  ]

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Royalties</h1>
              <p className="text-gray-600 dark:text-gray-400">Know what you are owed. Get paid on time.</p>
            </div>
            <Link href="/royalties/register" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">+ Add a track</Link>
          </div>
        </div>
                {/* Connect source banner */}
        <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-900 rounded-xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Import a statement</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload a CSV from your distributor, PRO, or publisher.</p>
          </div>
          <Link href="/royalties/connect" className="px-5 py-2.5 rounded-full text-sm font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors">
            Connect a source
          </Link>
        </div>
        <RoyaltySnapshot data={snapshot} />
        <RoyaltySplits splits={splits} />
        <RoyaltyStatements statements={statements} />
        <RoyaltyPayouts available={124000} payouts={payouts} />
        <div className="mt-8"><RoyaltyRegistrationCTA /></div>
        <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Why is some money unclaimed?</h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p><strong className="text-gray-900 dark:text-gray-100">Missing ISRC codes</strong> - Your distributor needs the ISRC for every track. If a track has no ISRC, streaming services cannot report its earnings to you.</p>
            <p><strong className="text-gray-900 dark:text-gray-100">Unregistered works</strong> - Your PRO (PRS, BMI, ASCAP) needs to know about every song you write. If a song is not registered, your publishing royalties stay in the society.</p>
            <p><strong className="text-gray-900 dark:text-gray-100">Unassigned splits</strong> - If a track has earnings but no collaborators assigned, the money is held until splits are set. GRID warns you before the period closes.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

