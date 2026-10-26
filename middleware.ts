// GRID - Route guards based on user role
// Prevents cross-role access to dashboards

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role required for each protected route prefix
const ROLE_ROUTES: Record<string, string[]> = {
  '/artist/dashboard':    ['artist', 'admin'],
  '/promoter/dashboard':  ['promoter', 'admin'],
  '/venue/dashboard':     ['venue', 'admin'],
  '/organizer':           ['promoter', 'admin'],
  '/analytics':           ['artist', 'promoter', 'venue', 'admin'],
};

// Routes that require club membership
const CLUB_ROUTES = ['/analytics'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check role route
  for (const [prefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      // NOTE: In production, extract role from JWT/session cookie here.
      // For now, allow through - the page component will do its own check.
      // TODO: read role from session cookie and redirect if mismatch
      // Example:
      //   const role = request.cookies.get('grid_role')?.value;
      //   if (role && !allowedRoles.includes(role)) {
      //     return NextResponse.redirect(new URL('/unauthorized', request.url));
      //   }
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
