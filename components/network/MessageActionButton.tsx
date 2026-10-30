'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function MessageActionButton({
  userId,
  userName,
}: {
  userId: string
  userName?: string | null
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (busy) return
    setBusy(true)
    router.push('/messages?to=' + userId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
      aria-label={userName ? 'Message ' + userName : 'Send message'}
    >
      {busy ? 'Opening...' : 'Message'}
    </button>
  )
}
