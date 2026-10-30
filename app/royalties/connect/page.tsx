'use client'

import Link from 'next/link'
import { useState } from 'react'
import { StatementUploader } from '@/components/royalties/StatementUploader'
import { ColumnMapper } from '@/components/royalties/ColumnMapper'
import type { ParsedRow } from '@/components/royalties/StatementUploader'
import type { ColumnMapping } from '@/components/royalties/ColumnMapper'

const SOURCES = [
  { id: 'distrokid', name: 'DistroKid', type: 'Distributor', note: 'Download your monthly sales CSV from DistroKid dashboard' },
  { id: 'tunecore', name: 'TuneCore', type: 'Distributor', note: 'Export your statement from TuneCore Earnings' },
  { id: 'spotify', name: 'Spotify for Artists', type: 'DSP', note: 'Download the monthly reports CSV' },
  { id: 'apple', name: 'Apple Music', type: 'DSP', note: 'Export reports from Apple Music for Artists' },
  { id: 'prs', name: 'PRS for Music', type: 'PRO', note: 'Download your royalty statement from PRS portal' },
  { id: 'bmi', name: 'BMI', type: 'PRO', note: 'Export from BMI songwriter portal' },
  { id: 'ascap', name: 'ASCAP', type: 'PRO', note: 'Export from ASCAP member portal' },
  { id: 'mlc', name: 'The MLC', type: 'Mechanical', note: 'Download from themlc.com dashboard' },
  { id: 'bandcamp', name: 'Bandcamp', type: 'Direct', note: 'Export sales CSV from Bandcamp Tools' },
]

type Stage = 'pick-source' | 'upload' | 'map' | 'done'

export default function ConnectSourcePage() {
  const [stage, setStage] = useState<Stage>('pick-source')
  const [source, setSource] = useState<{ id: string; name: string } | null>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [mapping, setMapping] = useState<ColumnMapping | null>(null)

  function pickSource(s: { id: string; name: string }) {
    setSource(s)
    setStage('upload')
  }

  function onParsed(parsed: ParsedRow[]) {
    if (parsed.length === 0) return
    setRows(parsed)
    setStage('map')
  }

  function onConfirmMapping(m: ColumnMapping) {
    setMapping(m)
    setStage('done')
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/royalties" className="text-sm text-gray-500 dark:text-gray-400 hover:underline mb-6 inline-block">
          Back to Royalties
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Connect a source</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Import a royalty statement from any distributor, PRO, publisher, or direct sales platform.
        </p>

        {stage === 'pick-source' && (
          <div className="space-y-3">
            {SOURCES.map(function(s) {
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={function() { pickSource(s) }}
                  className="w-full text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:border-green-500 dark:hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{s.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.note}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">{s.type}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {stage === 'upload' && source && (
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Importing from</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{source.name}</p>
            </div>
            <StatementUploader onParsed={onParsed} />
            <button type="button" onClick={function() { setStage('pick-source'); setSource(null) }} className="mt-4 text-sm text-gray-500 dark:text-gray-400 underline">
              Choose a different source
            </button>
          </div>
        )}

        {stage === 'map' && rows.length > 0 && (
          <ColumnMapper headers={Object.keys(rows[0])} sampleRows={rows} onConfirm={onConfirmMapping} />
        )}

        {stage === 'done' && mapping && (
          <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-900 rounded-xl p-8 text-center">
            <p className="text-4xl mb-4">V</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mapping saved</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {rows.length} rows mapped from {source ? source.name : 'your file'}.
              Next step: wire this to Supabase so the rows become royalty_statements records.
            </p>
            <Link href="/royalties" className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Back to dashboard
            </Link>
          </div>
        )}

        <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">What is supported now</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>CSV files with a header row</li>
            <li>JSON files that are arrays of objects</li>
          </ul>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">Coming next</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>Excel (.xlsx) parsing</li>
            <li>PDF statement extraction (needs backend parser)</li>
            <li>Direct API sync with DistroKid, TuneCore, Spotify, PRS</li>
            <li>Automatic ISRC matching</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
