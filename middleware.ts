// GRID - Route guards based on user role
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('grid_role')?.value || null;
  const club = request.cookies.get('grid_club')?.value || 'free';

  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      // If we know the role and it doesn't match, redirect
      if (role && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      // Analytics requires Club membership
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
