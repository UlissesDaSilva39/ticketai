'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DiscoverEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [search, setSearch] = useState('London')
  const [loading, setLoading] = useState(true)

  const fetchEvents = async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/events?keyword=${query}`)
      const data = await res.json()
      setEvents(data.events || [])
    } catch (e) {
      console.error("Failed to load events", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents('London')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchEvents(search)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Discover events</h1>
        <p className="text-gray-600">Find your next live experience. Filter by date, city, genre, and price.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city (e.g. London, Manchester)..."
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
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No events found for "{search}". Try "London" or "Rock".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <div key={event.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white flex flex-col">
              
              <div className="h-48 bg-gray-100 relative">
                <img 
                  src={event.image} 
                  alt={event.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">{event.name}</h3>
                <p className="text-sm text-gray-600 font-medium mb-3">{event.date}</p>
                
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>{event.venue}, {event.city}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    {event.priceMin ? (
                      <p className="text-sm font-semibold text-gray-900">From £{event.priceMin}</p>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">See price on TM</p>
                    )}
                  </div>
                  <a 
                    href={event.tmUrl} 
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