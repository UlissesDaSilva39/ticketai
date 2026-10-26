'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ArtistClient({ id }: { id: string }) {
  const [artist, setArtist] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArtist() {
      try {
        const res = await fetch(`/api/artists?id=${id}`)
        const data = await res.json()
        setArtist(data)
      } catch (e) {
        console.error("Failed to load artist")
      } finally {
        setLoading(false)
      }
    }
    fetchArtist()
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading artist...</div>
  }

  if (!artist || artist.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Artist not found</h1>
        <p className="text-gray-500 mb-4">API returned: {artist?.error || 'Unknown error'}</p>
        <Link href="/artists" className="text-blue-500 hover:underline">Back to Artists</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="h-64 md:h-80 w-full relative bg-gray-900">
        <img src={artist.image} alt="Cover" className="w-full h-full object-cover opacity-60 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
          />
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{artist.name}</h1>
              {artist.verified && (
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              )}
            </div>
            <p className="text-lg text-gray-600 font-medium">{artist.genre}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{artist.bio}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Live Shows</h2>
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                <p className="text-gray-500 mb-4">Tickets and tour dates are managed by Ticketmaster.</p>
                <a 
                  href={artist.tmUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Tickets ↗
                </a>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Booking</h3>
              <p className="text-sm text-gray-600 mb-6">Request {artist.name} for your next event. Escrow protected.</p>
              <Link href="/signup" className="block w-full text-center bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Sign up to book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}