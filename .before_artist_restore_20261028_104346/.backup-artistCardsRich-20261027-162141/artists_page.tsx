'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DiscoverArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [search, setSearch] = useState('London')
  const [loading, setLoading] = useState(true)

  const fetchArtists = async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/artists?keyword=${query}`)
      const data = await res.json()
      setArtists(data.artists || [])
    } catch (e) {
      console.error("Failed to load artists", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists('London')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchArtists(search)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Discover artists</h1>
        <p className="text-gray-600">Browse real artists playing in your city.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by artist or city (e.g. London)..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
          Search
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-72 w-full"></div>
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No artists found for "{search}". Try "London", "Rock", or "Taylor Swift".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist: any) => (
            <Link key={artist.id} href={`/artists/${artist.id}`} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
              <div className="h-48 bg-gray-100 relative">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {artist.verified && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 shadow-md">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:underline line-clamp-1">{artist.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{artist.genre}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{artist.followers.toLocaleString()} fans</span>
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