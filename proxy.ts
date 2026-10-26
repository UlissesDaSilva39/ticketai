// GRID - Proxy (migrated from middleware.ts for Next.js 16)
// Next.js 16 requires the middleware logic to live in proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_ROUTES: Record<string, string[]> = {
  '/artist/dashboard':    ['artist', 'admin'],
  '/promoter/dashboard':  ['promoter', 'admin'],
  '/venue/dashboard':     ['venue', 'admin'],
  '/organizer':           ['promoter', 'admin'],
  '/analytics':           ['artist', 'promoter', 'venue', 'admin'],
};

const CLUB_ROUTES = ['/analytics'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('grid_role')?.value || null;
  const club = request.cookies.get('grid_club')?.value || 'free';

  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (role && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      if (CLUB_ROUTES.some((p) => pathname.startsWith(p))) {
        if (club !== 'pro' && club !== 'premium') {
          return NextResponse.redirect(new URL('/club/upgrade', request.url));
        }
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
    '/organizer/:path*',
    '/analytics/:path*',
  ],
};
