import { NextResponse } from 'next/server'

export async function proxy(request) {
  const { pathname } = request.nextUrl

  // ❌ ARCHITECTURE RULE: API routes NEVER block or redirect in proxy
  // This prevents 'Unexpected token <' (HTML-as-JSON) errors.
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Next.js internal routes and public assets
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico') || 
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Public pages
  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/about' || pathname.startsWith('/animals')) {
    return NextResponse.next()
  }

  // 🔐 Page Guard: Only redirect for protected pages
  // We use a more flexible cookie check to detect the Better Auth session token
  const cookies = request.cookies.getAll()
  const hasSession = cookies.some(c => c.name.includes('session_token'))

  if (!hasSession) {
    console.log('Proxy: No session cookie found for protected page, redirecting to login:', pathname)
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
