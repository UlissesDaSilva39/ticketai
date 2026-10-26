'use client'
import { useState, useEffect } from 'react'

export default function DiscoverFestivalsPage() {
  const [festivals, setFestivals] = useState<any[]>([])
  const [search, setSearch] = useState('Festival')
  const [loading, setLoading] = useState(true)

  const fetchFestivals = async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/festivals?keyword=${query}`)
      const data = await res.json()
      setFestivals(data.festivals || [])
    } catch (e) {
      console.error("Failed to load festivals", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFestivals('Festival')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchFestivals(search)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Discover festivals</h1>
        <p className="text-gray-600">The biggest multi-day events, lineups, and weekenders.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search festivals (e.g. Glastonbury)..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
          Search
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-80 w-full"></div>
          ))}
        </div>
      ) : festivals.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No festivals found for "{search}". Try "Music Festival".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {festivals.map((fest: any) => (
            <div key={fest.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white flex flex-col">
              
              <div className="h-56 bg-gray-100 relative">
                <img 
                  src={fest.image} 
                  alt={fest.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-black">
                  FESTIVAL
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">{fest.name}</h3>
                
                <p className="text-sm font-semibold text-gray-900 mb-2">{fest.date}</p>
                
                <div className="flex items-start gap-1.5 mb-4 text-sm text-gray-500">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="line-clamp-2">{fest.venue}, {fest.city}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    {fest.priceMin ? (
                      <p className="text-sm font-semibold text-gray-900">From £{fest.priceMin}</p>
                    ) : (
                      <p className="text-sm font-semibold text-gray-500">See price on TM</p>
                    )}
                  </div>
                  <a 
                    href={fest.tmUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Get Tickets ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}