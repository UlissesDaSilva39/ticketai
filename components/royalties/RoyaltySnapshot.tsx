export type SnapshotData = {
  thisMonth: number
  pending: number
  paidYtd: number
  unclaimed: number
}

function formatMoney(cents: number) {
  return '£' + (cents / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function RoyaltySnapshot({ data }: { data: SnapshotData }) {
  const cards = [
    { label: 'This month', value: data.thisMonth, sub: 'Gross across all sources', accent: false },
    { label: 'Pending', value: data.pending, sub: 'Earned, not yet paid out', accent: false },
    { label: 'Paid YTD', value: data.paidYtd, sub: 'Already in your account', accent: false },
    { label: 'Unclaimed', value: data.unclaimed, sub: 'Sitting in societies - register to claim', accent: true },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map(function(c) {
        return (
          <div key={c.label} className={c.accent ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-5' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5'}>
            <p className={c.accent ? 'text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400 mb-2' : 'text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2'}>{c.label}</p>
            <p className={c.accent ? 'text-2xl font-bold text-red-700 dark:text-red-400' : 'text-2xl font-bold text-gray-900 dark:text-gray-100'}>{formatMoney(c.value)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{c.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
