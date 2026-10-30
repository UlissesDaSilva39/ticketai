import Link from 'next/link'

type Show = {
  id: string
  title?: string | null
  name?: string | null
  starts_at?: string | null
  start_time?: string | null
  city?: string | null
  venue_name?: string | null
}

function formatDate(iso?: string | null) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  } catch { return '' }
}

export function ArtistUpcomingShows({ shows }: { shows: Show[] }) {
  if (!shows || shows.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Live Shows</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No upcoming shows announced.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Live Shows</h2>
      <div className="space-y-2">
        {shows.slice(0, 5).map(function(s) {
          const title = s.title || s.name || 'Untitled show'
          const dateStr = formatDate(s.starts_at || s.start_time)
          const place = [s.venue_name, s.city].filter(Boolean).join(' - ')
          return (
            <Link
              key={s.id}
              href={'/event/' + s.id}
              className="block p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {title}
                  </p>
                  {place && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{place}</p>
                  )}
                </div>
                {dateStr && (
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {dateStr}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
