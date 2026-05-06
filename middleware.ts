import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/',
  '/about',
  '/animals',
  '/animals/',
  '/api/auth',
  '/api/auth/',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/callback',
  '/api/auth/session',
  '/api/auth/csrf'
]

const PUBLIC_FILE = /\.(.*)$/

function isPublicPath(pathname: string) {
  if (PUBLIC_FILE.test(pathname)) {
    return true
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return true
  }

  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const cookieValue =
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value

  if (!cookieValue) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
