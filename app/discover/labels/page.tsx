'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DiscoverLabelsPage() {
  const [labels, setLabels] = useState<any[]>([])
  const [search, setSearch] = useState('Records')
  const [loading, setLoading] = useState(true)

  const fetchLabels = async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/labels?keyword=${query}`)
      const data = await res.json()
      setLabels(data.labels || [])
    } catch (e) {
      console.error("Failed to load labels", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLabels('Records')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchLabels(search)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Discover labels</h1>
        <p className="text-gray-600">Explore the record labels shaping the sound of the underground.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search labels (e.g. Records, Label)..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
          Search
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-64 w-full"></div>
          ))}
        </div>
      ) : labels.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No labels found for "{search}". Try "Records" or "Music".
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {labels.map((label: any) => (
            <Link key={label.id} href={`/labels/${label.id}`} className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white flex flex-col">
              
              <div className="h-40 bg-gray-100 relative">
                <img 
                  src={label.image} 
                  alt={label.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                {label.verified && (
                  <span className="inline-block text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 w-max">VERIFIED</span>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:underline line-clamp-1">{label.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{label.city}</p>
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">{label.bio}</p>
                
                <div className="mt-auto flex flex-wrap gap-2">
                  {label.tags.map((tag: string) => (
                    <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}