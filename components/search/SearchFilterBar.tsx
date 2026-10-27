'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const CITIES = ['London', 'Manchester', 'Birmingham', 'Bristol', 'Leeds', 'Glasgow']
const GENRES = ['Music', 'Rock', 'Pop', 'Hip-Hop/Rap', 'Dance/Electronic', 'Jazz', 'R&B', 'Indie']

export function SearchFilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const activeCity = searchParams.get('city') || 'London'
  const activeGenre = searchParams.get('genre') || 'Music'
  const [search, setSearch] = useState(searchParams.get('q') || '')

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'Music' && value !== 'London') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('q', search)
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
          Search
        </button>
      </form>

      {/* Cities */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-gray-500 self-center font-medium">Cities:</span>
        {CITIES.map(city => (
          <button 
            key={city}
            onClick={() => updateFilter('city', city)}
            className={`px-3 py-1 rounded-full transition ${activeCity === city ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Genres */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="text-gray-500 self-center font-medium">Genres:</span>
        {GENRES.map(genre => (
          <button 
            key={genre}
            onClick={() => updateFilter('genre', genre)}
            className={`px-3 py-1 rounded-full transition ${activeGenre === genre ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}