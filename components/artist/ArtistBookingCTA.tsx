'use client'

import Link from 'next/link'

export function ArtistBookingCTA({
  artistId,
  isLoggedIn,
  artistSlug,
}: {
  artistId: string
  isLoggedIn: boolean
  artistSlug?: string | null
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Book this artist</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Request a booking for your next event. Escrow protected — the artist gets paid after the show.
      </p>
      {isLoggedIn ? (
        <Link
          href={'/book/artist/' + (artistSlug || artistId)}
          className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Request booking
        </Link>
      ) : (
        <Link
          href="/signup"
          className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Sign up to book
        </Link>
      )}
    </div>
  )
}
