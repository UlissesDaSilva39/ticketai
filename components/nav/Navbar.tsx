'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

type NavItem = {
  label: string
  href?: string
  dropdown?: { label: string; href: string }[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Discover',
    dropdown: [
      { label: 'Overview', href: '/discover' },
      { label: 'Events', href: '/discover/events' },
      { label: 'Venues', href: '/discover/venues' },
      { label: 'Promoters', href: '/discover/promoters' },
      { label: 'Festivals', href: '/discover/festivals' },
      { label: 'Labels', href: '/discover/labels' },
    ],
  },
  { label: 'Search', href: '/search' },
  {
    label: 'Artists',
    dropdown: [
      { label: 'All Artists', href: '/artists' },
      { label: 'DJs', href: '/artists?type=dj' },
      { label: 'Producers', href: '/artists?type=producer' },
      { label: 'Vocalists', href: '/artists?type=vocalist' },
      { label: 'Bands', href: '/artists?type=band' },
    ],
  },
  { label: 'Music', href: '/music' },
  {
    label: 'Social',
    dropdown: [
      { label: 'Feed', href: '/feed' },
      { label: 'People', href: '/people' },
      { label: 'Messages', href: '/messages' },
      { label: 'Following', href: '/following' },
    ],
  },
  {
    label: 'Network',
    dropdown: [
      { label: 'People', href: '/network' },
      { label: 'Venues', href: '/network?tab=venues' },
      { label: 'Promoters', href: '/network?tab=promoters' },
    ],
  },
  { label: 'Industry', href: '/industry' },
  { label: 'Business', href: '/business' },
]

type NavUser = {
  id?: string
  email?: string
  name?: string
  role?: string | null
} | null

export function Navbar({ user: initialUser }: { user?: NavUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<NavUser>(initialUser || null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    if (initialUser) setCurrentUser(initialUser)
  }, [initialUser])

  useEffect(() => {
    setShowUserMenu(false)
    setOpenDropdown(null)
  }, [pathname])

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null)
      } else if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, full_name, role')
            .eq('id', session.user.id)
            .maybeSingle()

          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.full_name || profile?.username || session.user.email?.split('@')[0] || 'User',
            role: profile?.role || 'fan',
          })
        } catch (e) {
          console.error('Profile fetch failed', e)
        }
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const isAuthenticated = !!currentUser

  const handleProtectedClick = (e: React.MouseEvent, href?: string) => {
    if (!href || href === '/' || href === '#') return
    if (!isAuthenticated && !href.startsWith('/discover') && href !== '/artists' && href !== '/music' && href !== '/search') {
      e.preventDefault()
      router.push('/login')
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      )
      await supabase.auth.signOut()
      setCurrentUser(null)
      setShowUserMenu(false)
      window.location.href = '/'
    } catch (err) {
      window.location.href = '/'
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-2xl tracking-tight">GRID</Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              if (item.dropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1">
                      {item.label}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={(e) => handleProtectedClick(e, sub.href)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <Link
                  key={item.label}
                  href={item.href || '#'}
                  onClick={(e) => handleProtectedClick(e, item.href)}
                  className="px-3 py-2 text-sm font-medium hover:text-black text-gray-700"
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 hover:opacity-80">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {currentUser.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-2 w-64 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Profile</Link>
                  <Link href="/my-tickets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>My Tickets</Link>
                  <Link href="/wallet" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Wallet</Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Settings</Link>
                  {currentUser.role === 'admin' && (
                    <Link href="/admin/featured" className="block px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50" onClick={() => setShowUserMenu(false)}>
                      Admin · Featured placements
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Log out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black px-3 py-2">Log in</Link>
              <Link href="/signup" className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
