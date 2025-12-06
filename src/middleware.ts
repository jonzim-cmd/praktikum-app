import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/passwort-vergessen', '/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for session cookie (Better Auth uses this pattern)
  const sessionCookie = request.cookies.get('better-auth.session_token');

  // Allow public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    // If logged in and trying to access login, redirect to dashboard
    if (pathname === '/login' && sessionCookie) {
      return NextResponse.redirect(new URL('/schueler', request.url));
    }
    return NextResponse.next();
  }

  // Root path: redirect to login or dashboard based on auth status
  if (pathname === '/') {
    if (sessionCookie) {
      // Redirect to a default dashboard - the actual role-based redirect
      // happens in the client-side session check in the login page
      return NextResponse.redirect(new URL('/schueler', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protected routes: require authentication
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)',
  ],
};
