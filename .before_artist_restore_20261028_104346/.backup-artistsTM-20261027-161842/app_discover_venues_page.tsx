'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DiscoverVenuesPage() {
  const [venues, setVenues] = useState<any[]>([])
  const [search, setSearch] = useState('London')
  const [loading, setLoading] = useState(true)

  const fetchVenues = async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/venues?keyword=${query}`)
      const data = await res.json()
      setVenues(data.venues || [])
    } catch (e) {
      console.error("Failed to load venues", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVenues('London')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVenues(search)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Discover venues</h1>
        <p className="text-gray-600">Browse real venues and clubs powered by Ticketmaster.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city (e.g. London, Berlin)..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
          Search
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-64 w-full"></div>
          ))}
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No venues found for "{search}". Try "London" or "Manchester".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue: any) => (
            <Link key={venue.id} href={`/venues/${venue.id}`} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
              <div className="h-48 bg-gray-100 relative">
                {/* The onError fallback ensures that even if Ticketmaster sends a broken link, the UI doesn't break */}
                <img 
                  src={venue.image} 
                  alt={venue.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // If the real image fails to load, fall back to a generic venue photo
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80';
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:underline line-clamp-1">{venue.name}</h3>
                <p className="text-sm text-gray-600">{venue.city}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">Venue</span>
                  <span className="text-sm font-semibold text-black">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}