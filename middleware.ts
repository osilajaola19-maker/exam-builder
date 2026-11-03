import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect dashboard routes - redirect to signin if no auth cookie
  if (path.startsWith('/dashboard')) {
    const authCookie = request.cookies.get('sb-access-token') || 
                      request.cookies.get('sb-pqcttmpbwdhpkwaajqrr-auth-token')
    
    if (!authCookie) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Redirect authenticated users away from auth pages (except callback)
  if (path.startsWith('/auth') && !path.includes('/callback')) {
    const authCookie = request.cookies.get('sb-access-token') || 
                      request.cookies.get('sb-pqcttmpbwdhpkwaajqrr-auth-token')
    
    if (authCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
