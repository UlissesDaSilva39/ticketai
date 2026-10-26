'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LabelClient({ id }: { id: string }) {
  const [label, setLabel] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLabel() {
      try {
        const res = await fetch(`/api/labels?id=${id}`)
        const data = await res.json()
        setLabel(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchLabel()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading label...</div>
  if (!label || label.error) return <div className="text-center py-20">Label not found</div>

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* COVER PHOTO */}
      <div className="h-64 md:h-80 w-full relative bg-gray-900">
        <img src={label.image} alt="Cover" className="w-full h-full object-cover opacity-60 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          {/* PROFILE LOGO */}
          <img 
            src={label.image} 
            alt={label.name} 
            className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-white shadow-xl bg-gray-100" 
          />
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{label.name}</h1>
              {label.verified && (
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              )}
            </div>
            <p className="text-lg text-gray-600 font-medium">{label.city} · Record Label</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{label.bio}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Roster & Releases</h2>
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                <p className="text-gray-500 mb-4">Discover the artists and latest releases from {label.name}.</p>
                <a 
                  href={label.tmUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View on Ticketmaster ↗
                </a>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Submit a Demo</h3>
              <p className="text-sm text-gray-600 mb-6">Pitch your music directly to the A&R team.</p>
              <Link href="/signup" className="block w-full text-center bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Sign up to contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}