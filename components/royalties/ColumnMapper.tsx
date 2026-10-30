'use client'

import { useState } from 'react'

export type ParsedRow = Record<string, string>

const REQUIRED_FIELDS = [
  { key: 'title', label: 'Track title', required: true },
  { key: 'isrc', label: 'ISRC code', required: false },
  { key: 'period', label: 'Period (e.g. Oct 2026)', required: true },
  { key: 'gross', label: 'Gross amount', required: true },
  { key: 'fees', label: 'Fees deducted', required: false },
  { key: 'net', label: 'Net amount', required: true },
] as const

export type ColumnMapping = Record<string, string>

export function ColumnMapper({
  headers,
  sampleRows,
  onConfirm,
}: {
  headers: string[]
  sampleRows: ParsedRow[]
  onConfirm: (mapping: ColumnMapping) => void
}) {
  const [mapping, setMapping] = useState<ColumnMapping>({})

  function setField(field: string, column: string) {
    setMapping(function(prev) {
      const next = Object.assign({}, prev)
      if (column === '') delete next[field]
      else next[field] = column
      return next
    })
  }

  function isComplete(): boolean {
    return REQUIRED_FIELDS.filter(function(f) { return f.required }).every(function(f) { return !!mapping[f.key] })
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Map your columns</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tell GRID which column in your file holds each value.</p>

      <div className="space-y-3 mb-6">
        {REQUIRED_FIELDS.map(function(field) {
          return (
            <div key={field.key} className="grid grid-cols-2 gap-3 items-center">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                value={mapping[field.key] || ''}
                onChange={function(e) { setField(field.key, e.target.value) }}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="">- not mapped -</option>
                {headers.map(function(h) { return <option key={h} value={h}>{h}</option> })}
              </select>
            </div>
          )
        })}
      </div>

      <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-3 mb-6 overflow-x-auto">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Preview (first 3 rows)</p>
        <table className="text-xs">
          <thead>
            <tr>
              {headers.map(function(h) { return <th key={h} className="text-left px-2 py-1 text-gray-500 dark:text-gray-400 font-semibold">{h}</th> })}
            </tr>
          </thead>
          <tbody>
            {sampleRows.slice(0, 3).map(function(r, i) {
              return (
                <tr key={i}>
                  {headers.map(function(h) { return <td key={h} className="px-2 py-1 text-gray-700 dark:text-gray-300">{r[h] || ''}</td> })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        disabled={!isComplete()}
        onClick={function() { onConfirm(mapping) }}
        className="w-full px-6 py-3 rounded-full text-sm font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-30 transition-colors"
      >
        {isComplete() ? 'Import statement' : 'Map all required fields first'}
      </button>
    </div>
  )
}
