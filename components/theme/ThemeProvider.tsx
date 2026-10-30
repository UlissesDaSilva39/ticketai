'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  toggle: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'grid-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getInitialTheme()
    setThemeState(initial)
    const root = document.documentElement
    if (initial === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    setMounted(true)
  }, [])

  function setTheme(t: Theme) {
    setThemeState(t)
    const root = document.documentElement
    if (t === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try { window.localStorage.setItem(STORAGE_KEY, t) } catch {}
  }

  function toggle() { setTheme(theme === 'dark' ? 'light' : 'dark') }

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
