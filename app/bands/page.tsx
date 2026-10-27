'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { SearchFilterBar } from '@/components/search/SearchFilterBar'

function EntityList() {
  const searchParams = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const params = searchParams.toString()
      try {
        const res = await fetch(`/api/bands?${params}`)
        const data = await res.json()
        setItems(data.data || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [searchParams])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Bands</h1>
      <p className="text-gray-600 mb-8">Browse and filter by city and genre.</p>

      <Suspense fallback={<div>Loading filters...</div>}>
        <SearchFilterBar />
      </Suspense>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No results found for your filters.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/bands/${item.slug || item.id}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div className="h-32 sm:h-40 bg-gray-100 relative">
                <img src={item.avatar_url || item.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-900 truncate">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.genre || 'Music'}</p>
                <p className="text-xs text-gray-400 mt-1">{item.city || 'UK'}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><EntityList /></Suspense>
}