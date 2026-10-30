export function NetworkReasonBadge({
  mutualCount,
  recentActivity,
  joinedRecently,
}: {
  mutualCount?: number
  recentActivity?: string | null
  joinedRecently?: boolean
}) {
  if (mutualCount && mutualCount > 0) {
    return (
      <p className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        Followed by {mutualCount} {mutualCount === 1 ? 'person' : 'people'} you follow
      </p>
    )
  }
  if (recentActivity) {
    return (
      <p className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        {recentActivity}
      </p>
    )
  }
  if (joinedRecently) {
    return (
      <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
        New to GRID
      </p>
    )
  }
  return null
}
