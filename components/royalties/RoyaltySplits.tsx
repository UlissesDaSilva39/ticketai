export type SplitRow = {
  id: string
  track_title: string
  artist_name: string
  status: 'assigned' | 'missing' | 'partial'
  collaborators: string[]
  earnedThisMonth: number
}

function formatMoney(cents: number) {
  return '£' + (cents / 100).toFixed(2)
}

export function RoyaltySplits({ splits }: { splits: SplitRow[] }) {
  const missing = splits.filter(function(s) { return s.status !== 'assigned' })
  const hasWarnings = missing.length > 0
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Splits</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Who gets paid for each track</p>
        </div>
        <button type="button" className="px-4 py-2 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Assign splits</button>
      </div>
      {hasWarnings && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4 mb-4">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">{missing.length} {missing.length === 1 ? 'track has' : 'tracks have'} earnings but incomplete splits</p>
          <p className="text-xs text-red-600 dark:text-red-500">Money earned on these tracks is being held. Assign splits before the period closes or collaborators will not be paid.</p>
        </div>
      )}
      <div className="space-y-2">
        {splits.map(function(s) {
          let badgeClass = ''
          let badgeText = ''
          if (s.status === 'assigned') {
            badgeClass = 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
            badgeText = 'Assigned'
          } else if (s.status === 'missing') {
            badgeClass = 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
            badgeText = 'No splits'
          } else {
            badgeClass = 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
            badgeText = 'Partial'
          }
          return (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{s.track_title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.artist_name}{s.collaborators.length > 0 ? ' - ' + s.collaborators.join(', ') : ''}</p>
              </div>
              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{formatMoney(s.earnedThisMonth)}</span>
              <span className={'px-2 py-1 rounded-full text-xs font-semibold ' + badgeClass}>{badgeText}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
