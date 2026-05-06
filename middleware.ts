import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

function isPublicPath(pathname: string) {
  // Static files
  if (PUBLIC_FILE.test(pathname)) {
    return true
  }

  // Next.js internal routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico') || pathname.startsWith('/static')) {
    return true
  }

  // Public pages
  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/about') {
    return true
  }

  // Public animal pages
  if (pathname.startsWith('/animals')) {
    return true
  }

  // CRITICAL: Never block NextAuth API routes
  if (pathname.startsWith('/api/auth')) {
    return true
  }

  // Allow other API routes that don't require auth
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/profile') && !pathname.startsWith('/api/bookings')) {
    return true
  }

  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  try {
    // Check for valid session token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      // In production, cookies are secure by default
      secureCookie: process.env.NODE_ENV === 'production' && request.url.startsWith('https://')
    })

    if (!token || !token.id) {
      console.log('Middleware: No valid token found, redirecting to login')
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Token is valid, allow the request
    return NextResponse.next()

  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'
  ]
}
