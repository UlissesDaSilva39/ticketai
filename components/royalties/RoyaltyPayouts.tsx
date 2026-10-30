export type PayoutRow = {
  id: string
  date: string
  amount: number
  method: string
  status: 'paid' | 'pending' | 'processing'
}

function formatMoney(cents: number) {
  return '£' + (cents / 100).toFixed(2)
}

export function RoyaltyPayouts({ available, payouts }: { available: number; payouts: PayoutRow[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Payouts</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Withdraw when you are ready</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-gray-900 border border-green-200 dark:border-green-900 rounded-xl p-6 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400 mb-1">Available balance</p>
        <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{formatMoney(available)}</p>
        <button type="button" className="px-6 py-2.5 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Withdraw</button>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Payout history</h3>
      <div className="space-y-2">
        {payouts.length === 0 && (<p className="text-sm text-gray-500 dark:text-gray-400 italic">No payouts yet.</p>)}
        {payouts.map(function(p) {
          let badgeClass = ''
          let badgeText = ''
          if (p.status === 'paid') {
            badgeClass = 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
            badgeText = 'Paid'
          } else if (p.status === 'processing') {
            badgeClass = 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
            badgeText = 'Processing'
          } else {
            badgeClass = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
            badgeText = 'Pending'
          }
          return (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatMoney(p.amount)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{p.date} - {p.method}</p>
              </div>
              <span className={'px-2 py-1 rounded-full text-xs font-semibold ' + badgeClass}>{badgeText}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
