import Link from 'next/link'
export type StatementRow = {
  id: string
  source: string
  period: string
  gross: number
  fees: number
  net: number
  status: 'matched' | 'unmatched' | 'pending'
}

function formatMoney(cents: number) {
  return '£' + (cents / 100).toFixed(2)
}

export function RoyaltyStatements({ statements }: { statements: StatementRow[] }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Statements</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Income from every source in one place</p>
        </div>
        <Link href="/royalties/connect" className="px-4 py-2 rounded-full text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Connect a source</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Source</th>
              <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Period</th>
              <th className="text-right py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Gross</th>
              <th className="text-right py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Fees</th>
              <th className="text-right py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Net</th>
              <th className="text-right py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {statements.map(function(s) {
              let badgeClass = ''
              let badgeText = ''
              if (s.status === 'matched') {
                badgeClass = 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                badgeText = 'Matched'
              } else if (s.status === 'unmatched') {
                badgeClass = 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                badgeText = 'Unmatched'
              } else {
                badgeClass = 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
                badgeText = 'Pending'
              }
              return (
                <tr key={s.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                  <td className="py-3 text-gray-900 dark:text-gray-100">{s.source}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{s.period}</td>
                  <td className="py-3 text-right font-mono text-gray-900 dark:text-gray-100">{formatMoney(s.gross)}</td>
                  <td className="py-3 text-right font-mono text-gray-500 dark:text-gray-400">{formatMoney(s.fees)}</td>
                  <td className="py-3 text-right font-mono font-semibold text-gray-900 dark:text-gray-100">{formatMoney(s.net)}</td>
                  <td className="py-3 text-right"><span className={'px-2 py-1 rounded-full text-xs font-semibold ' + badgeClass}>{badgeText}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

