type ArtistBioSectionProps = {
  bio?: string | null
  name?: string | null
}

export function ArtistBioSection({ bio, name }: ArtistBioSectionProps) {
  if (!bio || bio.trim().length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">About</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {name || 'This artist'} hasn't added a bio yet.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">About</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {bio}
      </p>
    </div>
  )
}
