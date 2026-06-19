import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected and public routes
  const isAuthRoute = pathname.startsWith('/acesso');
  const isAppRoute = pathname.startsWith('/app');
  
  // Get token from cookie (placeholder logic)
  const token = request.cookies.get('session-token');

  // If trying to access protected route without token
  if (isAppRoute && !token) {
    return NextResponse.redirect(new URL('/acesso/login', request.url));
  }

  // If trying to access auth route while logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
