import Link from 'next/link'

type SidebarProfile = {
  id: string
  username?: string | null
  display_name?: string | null
  role?: string | null
  city?: string | null
  avatar_url?: string | null
}

function getInitial(p: SidebarProfile): string {
  const name = p.display_name || p.username || '?'
  return name.charAt(0).toUpperCase()
}

function ProfileRow({ profile, subtitle }: { profile: SidebarProfile; subtitle?: string }) {
  const name = profile.display_name || profile.username || 'Unknown'
  const href = profile.username ? '/u/' + profile.username : '/people/' + profile.id
  const parts: string[] = []
  if (profile.role) parts.push(profile.role)
  if (profile.city) parts.push(profile.city)
  const fallbackSubtitle = parts.join(' - ')
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200 flex-shrink-0">
        {getInitial(profile)}
      </div>
      <div className="flex-1 min-w-0">
        <Link href={href} className="block text-sm font-semibold text-gray-900 dark:text-gray-100 truncate hover:underline">
          {name}
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {subtitle || fallbackSubtitle}
        </p>
      </div>
    </div>
  )
}

export function NetworkSidebar({
  intent,
  suggestions,
  cityProfiles,
}: {
  intent?: string | null
  suggestions?: SidebarProfile[]
  cityProfiles?: SidebarProfile[]
}) {
  const sugg = suggestions || []
  const city = cityProfiles || []
  return (
    <aside className="space-y-4">
      {intent === 'book' && city.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Top promoters this month
          </h3>
          {city.slice(0, 5).map(function(p) {
            return <ProfileRow key={p.id} profile={p} />
          })}
        </div>
      )}

      {intent === 'collaborate' && city.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Artists open to collaborations
          </h3>
          {city.slice(0, 5).map(function(p) {
            return <ProfileRow key={p.id} profile={p} />
          })}
        </div>
      )}

      {sugg.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            People you may know
          </h3>
          {sugg.slice(0, 5).map(function(p) {
            return <ProfileRow key={p.id} profile={p} subtitle="Mutual connections" />
          })}
        </div>
      )}

      {city.length > 0 && !intent && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
            Active in your city
          </h3>
          {city.slice(0, 5).map(function(p) {
            return <ProfileRow key={p.id} profile={p} />
          })}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          How GRID networking works
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2"><span className="text-green-500">-</span> Message anyone directly</li>
          <li className="flex gap-2"><span className="text-green-500">-</span> Bookings happen inside the app</li>
          <li className="flex gap-2"><span className="text-green-500">-</span> Your profile is your business card</li>
        </ul>
      </div>
    </aside>
  )
}
