'use client'

import { useRef, useState } from 'react'

export type ParsedRow = Record<string, string>

export function StatementUploader({
  onParsed,
}: {
  onParsed: (rows: ParsedRow[]) => void
}) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function parseCsv(text: string): ParsedRow[] {
    const lines = text.split(/\r?\n/).filter(function(l) { return l.trim().length > 0 })
    if (lines.length === 0) return []
    const headers = lines[0].split(',').map(function(h) { return h.trim().replace(/^"|"$/g, '') })
    const rows: ParsedRow[] = []
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(',').map(function(c) { return c.trim().replace(/^"|"$/g, '') })
      if (cells.length !== headers.length) continue
      const row: ParsedRow = {}
      headers.forEach(function(h, j) { row[h] = cells[j] })
      rows.push(row)
    }
    return rows
  }

  function handleFile(file: File) {
    setError(null)
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = function() {
      try {
        const text = String(reader.result || '')
        if (file.name.toLowerCase().endsWith('.csv')) {
          const rows = parseCsv(text)
          if (rows.length === 0) {
            setError('No rows found in the file. Check that it has a header row.')
            return
          }
          onParsed(rows)
        } else if (file.name.toLowerCase().endsWith('.json')) {
          const parsed = JSON.parse(text)
          if (Array.isArray(parsed)) onParsed(parsed)
          else setError('JSON must be an array of objects.')
        } else {
          setError('Only .csv and .json are supported right now.')
        }
      } catch (e) {
        setError('Could not read the file: ' + (e instanceof Error ? e.message : 'unknown error'))
      }
    }
    reader.readAsText(file)
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0]
    if (f) handleFile(f)
  }

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
      <input ref={fileRef} type="file" accept=".csv,.json" onChange={onChange} className="hidden" />
      {!fileName && (
        <>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Upload your statement</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">CSV or JSON. Excel and PDF supported later.</p>
          <button type="button" onClick={function() { if (fileRef.current) fileRef.current.click() }} className="px-6 py-2.5 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Choose file
          </button>
        </>
      )}
      {fileName && (
        <>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">File loaded</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{fileName}</p>
          <button type="button" onClick={function() { setFileName(null); setError(null); if (fileRef.current) fileRef.current.value = '' }} className="text-xs text-gray-500 dark:text-gray-400 underline">
            Choose a different file
          </button>
        </>
      )}
      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-3">
          <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
