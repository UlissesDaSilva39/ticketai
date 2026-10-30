'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const INTENTS = [
  {
    id: 'collaborate',
    icon: 'C',
    label: 'Collaborate',
    description: 'Find people to make music with',
    roles: ['producer', 'vocalist', 'band', 'dj'],
  },
  {
    id: 'book',
    icon: 'B',
    label: 'Book',
    description: 'Find people who can host your show',
    roles: ['promoter', 'venue'],
  },
  {
    id: 'host',
    icon: 'H',
    label: 'Host',
    description: 'Find acts to fill your room',
    roles: ['artist', 'band', 'dj'],
  },
  {
    id: 'work',
    icon: 'W',
    label: 'Work together',
    description: 'Industry professionals',
    roles: ['manager', 'label', 'agent'],
  },
] as const

export function NetworkIntentSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentIntent = searchParams.get('intent') || ''

  function selectIntent(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (id === currentIntent) {
      params.delete('intent')
    } else {
      params.set('intent', id)
    }
    const query = params.toString()
    router.push(query ? pathname + '?' + query : pathname)
  }

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
        I am looking for
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {INTENTS.map(function(intent) {
          const isActive = currentIntent === intent.id
          const baseClass = 'text-left p-4 rounded-xl border-2 transition-all'
          const activeClass = isActive
            ? 'border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-500'
            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
          const labelClass = isActive
            ? 'block text-sm font-semibold text-green-900 dark:text-green-100'
            : 'block text-sm font-semibold text-gray-900 dark:text-gray-100'
          const descClass = isActive
            ? 'block text-xs mt-1 text-green-700 dark:text-green-300'
            : 'block text-xs mt-1 text-gray-500 dark:text-gray-400'
          return (
            <button
              key={intent.id}
              type="button"
              onClick={function() { selectIntent(intent.id) }}
              className={baseClass + ' ' + activeClass}
            >
              <span className="text-2xl block mb-2">{intent.icon}</span>
              <span className={labelClass}>{intent.label}</span>
              <span className={descClass}>{intent.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function getIntentRoles(intentId: string): string[] | null {
  const found = INTENTS.find(function(i) { return i.id === intentId })
  if (!found) return null
  const roles: string[] = []
  found.roles.forEach(function(r) { roles.push(r) })
  return roles
}
