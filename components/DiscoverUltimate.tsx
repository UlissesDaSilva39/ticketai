'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function CarouselRow({ title, link, items, type }: { title: string, link: string, items: any[], type: 'square' | 'banner' }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!items || items.length === 0) return null

  return (
    <div className="mb-12 relative group">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {title}
          {title === 'Events' && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Trending</span>}
        </h2>
        <Link href={link} className="text-sm font-semibold text-gray-600 hover:text-black hover:underline">See all →</Link>
      </div>

      <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 mt-4 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-4 snap-x snap-mandatory">
        {items.map((item: any) => (
          <div key={item.id} className={`snap-start flex-none group/card ${type === 'square' ? 'w-48 md:w-56' : 'w-72 md:w-80'}`}>
            
            {/* The main card area is wrapped in a Link to the internal profile page */}
            <Link href={`/${type === 'banner' ? 'events' : title.toLowerCase()}/${item.id}`}>
              {type === 'square' ? (
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
                  {item.verified && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-md">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-40 rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
                  
                  {item.isUrgent && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> Selling Fast
                    </span>
                  )}
                  {item.price && (
                    <span className="absolute bottom-2 right-2 bg-white/90 text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
                      From £{item.price}
                    </span>
                  )}
                </div>
              )}

              <h3 className="font-bold text-gray-900 group-hover/card:underline line-clamp-1">{item.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{item.genre || item.date || item.venue || item.city}</p>
            </Link>
            
            {/* The "Buy Tickets" button is OUTSIDE the Link wrapper to prevent the nested <a> error */}
            {type === 'banner' && (
              <div className="mt-2">
                <a 
                  href={item.tmUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full text-center bg-black text-white text-sm font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Buy Tickets ↗
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 mt-4 -translate-y-1/2 z-10 bg-white/90 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>
  )
}

export default function DiscoverUltimate() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [query, setQuery] = useState('London')
  const [genre, setGenre] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [activeCity, setActiveCity] = useState('London')
  const [activeGenre, setActiveGenre] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = `/api/discover-ultimate?q=${query}`
      if (genre) url += `&genre=${genre}`
      if (maxPrice) url += `&maxPrice=${maxPrice}`
      
      const res = await fetch(url)
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [query, genre, maxPrice])

  const applyCity = (city: string) => {
    setQuery(city); setActiveCity(city); setGenre(''); setActiveGenre('')
  }

  const applyGenre = (g: string) => {
    setGenre(g); setActiveGenre(g)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 pt-6 pb-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Discover</h1>
          
          <form onSubmit={(e) => { e.preventDefault(); fetchData(); }} className="flex flex-col md:flex-row gap-3 max-w-3xl">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cities, artists, genres..."
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
            />
            <button type="submit" className="px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
              Search
            </button>
            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Filters
            </button>
          </form>

          {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl max-w-3xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Max Price (£{maxPrice || 'Any'})</label>
                <span className="text-xs text-gray-500">Drag to filter events</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="10"
                value={maxPrice || 500}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-black"
              />
            </div>
          )}

          <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar">
            <span className="text-sm font-semibold text-gray-400 py-1.5 mr-2">Cities:</span>
            {['London', 'Manchester', 'Berlin', 'Amsterdam', 'Paris'].map(tag => (
              <button 
                key={tag}
                onClick={() => applyCity(tag)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCity === tag ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-2 overflow-x-auto hide-scrollbar">
            <span className="text-sm font-semibold text-gray-400 py-1.5 mr-2">Genres:</span>
            {['Music', 'Rock', 'Pop', 'Hip-Hop/Rap', 'Dance/Electronic', 'Jazz'].map(tag => (
              <button 
                key={tag}
                onClick={() => applyGenre(tag)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeGenre === tag ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-[100rem] mx-auto mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading the scene...</div>
        ) : (
          <>
            <CarouselRow title="Artists" link="/discover/artists" items={data?.artists} type="square" />
            <CarouselRow title="Events" link="/discover/events" items={data?.events} type="banner" />
            <CarouselRow title="Festivals" link="/discover/festivals" items={data?.festivals} type="banner" />
            <CarouselRow title="Venues" link="/discover/venues" items={data?.venues} type="square" />
            <CarouselRow title="Promoters" link="/discover/promoters" items={data?.promoters} type="square" />
            <CarouselRow title="Labels" link="/discover/labels" items={data?.labels} type="square" />
          </>
        )}
      </div>
    </div>
  )
}