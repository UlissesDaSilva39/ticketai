'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DiscoverVenuesPage() {
  const [venues, setVenues] = useState<any[]>([])
  const [search, setSearch] = useState('London')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVenues = async (query: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/venues?keyword=${query}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setVenues([])
      } else {
        setVenues(data.venues || [])
      }
    } catch (e) {
      setError('Failed to load venues')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVenues('London') }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Discover venues</h1>
        <p className="text-gray-600">Browse real venues and clubs powered by Ticketmaster.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchVenues(search); }} className="mb-8 flex gap-2 max-w-md">
        <input 
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city (e.g. London, Berlin)..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
          Search
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading venues...</div>
      ) : venues.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No venues found for "{search}". Try "London" or "Manchester".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue: any) => (
            <Link key={venue.id} href={`/venues/${venue.id}`} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
              <div className="h-48 bg-gray-100 relative">
                <img src={venue.image} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:underline line-clamp-1">{venue.name}</h3>
                <p className="text-sm text-gray-600">{venue.city}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}