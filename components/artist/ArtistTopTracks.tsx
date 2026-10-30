'use client'

import { useState } from 'react'

type Track = {
  id: string
  title?: string | null
  name?: string | null
  audio_url?: string | null
  cover_url?: string | null
  duration?: number | null
}

function formatDuration(sec?: number | null) {
  if (!sec || sec < 1) return ''
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return m + ':' + (s < 10 ? '0' + s : String(s))
}

export function ArtistTopTracks({
  tracks,
  artistName,
}: {
  tracks: Track[]
  artistName?: string | null
}) {
  const [playing, setPlaying] = useState<string | null>(null)

  if (!tracks || tracks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Popular tracks</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No tracks uploaded yet.
        </p>
      </div>
    )
  }

  const top = tracks.slice(0, 5)

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Popular tracks</h2>
      <div className="space-y-2">
        {top.map(function(t, i) {
          const title = t.title || t.name || 'Untitled'
          const isPlaying = playing === t.id
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm text-gray-400 dark:text-gray-500 w-6 text-center font-mono">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {artistName || 'Unknown artist'}
                </p>
              </div>
              {t.duration ? (
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  {formatDuration(t.duration)}
                </span>
              ) : null}
              <button
                type="button"
                onClick={function() { setPlaying(isPlaying ? null : t.id) }}
                disabled={!t.audio_url}
                className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs hover:opacity-80 disabled:opacity-30 transition-opacity"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '\u23F8' : '\u25B6'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
