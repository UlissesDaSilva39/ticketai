// GRID - Proxy (route guards + role + club checks)
// Next.js 16 requires the middleware logic to live in proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// Route-to-role map - THE source of truth for access control
// Key = path prefix, Value = roles allowed to access
// ============================================================
const ROLE_ROUTES: Record<string, string[]> = {
  // ── Dashboards (role-specific) ───────────────────────────
  '/artist/dashboard':    ['artist', 'admin'],
  '/promoter/dashboard':  ['promoter', 'admin'],
  '/venue/dashboard':     ['venue', 'admin'],
  '/label/dashboard':     ['artist', 'promoter', 'venue', 'admin'],  // A&R / label uses artist role + subtype

  // ── Onboarding pages (must NOT be blocked - anyone can register) ──
  // Excluded from guards intentionally

  // ── Organizer tools (promoter only) ──────────────────────
  '/organizer':           ['promoter', 'admin'],

  // ── Analytics (Club members with any paid role) ──────────
  '/analytics':           ['artist', 'promoter', 'venue', 'admin'],
};

// Routes that require Club membership (any paid tier)
const CLUB_ROUTES = ['/analytics', '/club/manage'];

// Routes that bypass all guards (public, auth, onboarding)
const PUBLIC_PREFIXES = [
  '/',
  '/login',
  '/signup',
  '/register',
  '/artist/register',
  '/promoters/join',
  '/venues/join',
  '/auth',
  '/discover',
  '/search',
  '/artists',
  '/events',
  '/event',
  '/venues',
  '/venue',
  '/promoters',
  '/promoter',     // public profile (not /promoter/dashboard)
  '/labels',
  '/city',
  '/genre',
  '/u',
  '/feed',
  '/opportunities',   // public listings
  '/network',
  '/people',
  '/profile',         // public profiles
  '/clubs',
  '/checkout',
  '/confirmation',
  '/unauthorized',
  '/club/upgrade',    // the page anyone can land on
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('grid_role')?.value || null;
  const club = request.cookies.get('grid_club')?.value || 'free';
  const isClub = club === 'pro' || club === 'premium';

  // ── Public / onboarding paths bypass guards ──────────────
  const isPublic = PUBLIC_PREFIXES.some((p) =>
    p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(p + '/')
  );
  if (isPublic) return NextResponse.next();

  // ── Role route check ─────────────────────────────────────
  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      // If not logged in → send to login with redirect back
      if (!role) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', pathname);
        return NextResponse.redirect(loginUrl);
      }
      // Wrong role → unauthorized
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      // Club check
      if (CLUB_ROUTES.some((p) => pathname.startsWith(p)) && !isClub) {
        return NextResponse.redirect(new URL('/club/upgrade', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/artist/dashboard/:path*',
    '/promoter/dashboard/:path*',
    '/venue/dashboard/:path*',
    '/label/dashboard/:path*',
    '/organizer/:path*',
    '/analytics/:path*',
    '/club/manage/:path*',
  ],
};
