'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SearchOverview() {
  const [query, setQuery] = useState('London')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${query}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Search everything</h1>
        <p className="text-lg text-gray-600">Find artists, venues, and events in one place.</p>
        
        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything (e.g. London, Taylor Swift, Techno)..."
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button type="submit" className="px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-colors">
            Search
          </button>
        </form>
      </div>

      {loading && <div className="text-center py-20 text-gray-500">Searching the database...</div>}

      {data && !loading && (
        <div className="space-y-16 mt-12">
          
          {/* ARTISTS */}
          {data.artists?.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Artists matching "{query}"</h2>
                <Link href="/discover/artists" className="text-sm font-semibold text-black hover:underline">See all Artists →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data.artists.map((a: any) => (
                  <Link key={a.id} href={`/artists/${a.id}`} className="group">
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:underline line-clamp-1">{a.name}</h3>
                    <p className="text-sm text-gray-500">{a.genre}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* EVENTS */}
          {data.events?.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Events matching "{query}"</h2>
                <Link href="/discover/events" className="text-sm font-semibold text-black hover:underline">See all Events →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.events.map((e: any) => (
                  <div key={e.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col">
                    <div className="h-32 bg-gray-100"><img src={e.image} alt={e.name} className="w-full h-full object-cover" /></div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 line-clamp-1">{e.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 mb-3">{e.date} · {e.venue}</p>
                      <a href={e.tmUrl} target="_blank" rel="noopener noreferrer" className="mt-auto text-sm font-semibold text-black hover:underline">Get Tickets ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VENUES */}
          {data.venues?.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">Venues matching "{query}"</h2>
                <Link href="/discover/venues" className="text-sm font-semibold text-black hover:underline">See all Venues →</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {data.venues.map((v: any) => (
                  <Link key={v.id} href={`/venues/${v.id}`} className="group">
                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-gray-100">
                      <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:underline line-clamp-1">{v.name}</h3>
                    <p className="text-sm text-gray-500">{v.city}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  )
}