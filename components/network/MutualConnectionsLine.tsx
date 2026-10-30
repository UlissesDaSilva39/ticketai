export function MutualConnectionsLine({
  mutualCount,
}: {
  mutualCount?: number | null
}) {
  if (!mutualCount || mutualCount < 1) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      Followed by {mutualCount} {mutualCount === 1 ? 'person' : 'people'} you follow
    </p>
  )
}
