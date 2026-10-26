'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PromotersPage() {
  const [promoters, setPromoters] = useState([])
  const [search, setSearch] = useState('Live Nation')
  const [loading, setLoading] = useState(true)

  const fetchPromoters = async (query: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/promoters?keyword=${query}`)
      const data = await res.json()
      setPromoters(data.promoters || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPromoters('Live Nation') }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Discover promoters</h1>
      <p className="text-gray-600 mb-8">Find the people who fill rooms.</p>

      <form onSubmit={(e) => { e.preventDefault(); fetchPromoters(search); }} className="mb-8 flex gap-2 max-w-md">
        <input 
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search promoters..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg">Search</button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-60"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoters.map((p: any) => (
            <Link key={p.id} href={`/promoters/${p.id}`} className="group border rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white">
              <div className="h-40 bg-gray-100 relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:underline line-clamp-1">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.city}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}