'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DiscoverPromotersPage() {
  const [promoters, setPromoters] = useState<any[]>([])
  const [search, setSearch] = useState('Live Nation')
  const [loading, setLoading] = useState(true)

  const fetchPromoters = async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/promoters?keyword=${query}`)
      const data = await res.json()
      setPromoters(data.data || [])
    } catch (e) {
      console.error("Failed to load promoters", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromoters('Live Nation')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPromoters(search)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Discover promoters</h1>
        <p className="text-gray-600">The people who fill rooms. Search for promoters and organizers.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search promoters (e.g. Live Nation, AEG)..."
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
      ) : promoters.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No promoters found for "{search}". Try "Live Nation" or "Festival".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoters.map((p: any) => (
            <Link key={p.id} href={`/promoters/${p.id}`} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
              <div className="h-48 bg-gray-100 relative">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:underline line-clamp-1">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{p.city}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.eventsHosted} events</span>
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