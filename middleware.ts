import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for a protected route
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/api/listings') ||
                          request.nextUrl.pathname.startsWith('/api/audit-logs');

  // Check if the request is for the login page
  const isLoginPage = request.nextUrl.pathname === '/login';

  // For API routes, we'll let them handle authentication internally
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // For protected routes, redirect to login if not authenticated
  if (isProtectedRoute) {
    // In a real app, you'd check for a valid session/token here
    // For now, we'll let the client-side handle the redirect
    return NextResponse.next();
  }

  // For login page, redirect to dashboard if already authenticated
  if (isLoginPage) {
    // In a real app, you'd check for a valid session/token here
    // For now, we'll let the client-side handle the redirect
    return NextResponse.next();
  }

  return NextResponse.next();
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
}; 