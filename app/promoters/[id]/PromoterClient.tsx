'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PromoterClient({ id }: { id: string }) {
  const [p, setP] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/promoters?id=${id}`)
        const data = await res.json()
        setP(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading promoter...</div>
  if (!p || p.error) return <div className="text-center py-20">Promoter not found</div>

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* COVER IMAGE */}
      <div className="h-64 md:h-80 w-full relative bg-gray-900">
        <img src={p.image} alt="Cover" className="w-full h-full object-cover opacity-60 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          {/* PROFILE AVATAR */}
          <img 
            src={p.image} 
            alt={p.name} 
            className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-white shadow-xl bg-gray-100" 
          />
          <div className="mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{p.name}</h1>
            <p className="text-lg text-gray-600 font-medium">{p.city}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{p.bio}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Past Events</h2>
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                <p className="text-gray-500 mb-4">This promoter has hosted {p.eventsHosted}+ events.</p>
                <a 
                  href={p.tmUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View Events on Ticketmaster ↗
                </a>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Work with {p.name}</h3>
              <p className="text-sm text-gray-600 mb-6">Pitch your next event. Escrow protected.</p>
              <Link href="/signup" className="block w-full text-center bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}