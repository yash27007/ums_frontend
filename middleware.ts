import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const publicPaths = ['/login'];
  const path = request.nextUrl.pathname;

  if (!token && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If we have a token, verify role-based access
  if (token && !publicPaths.includes(path)) {
    try {
      const decoded = jwtDecode<{ user: { role: string } }>(token);
      const role = decoded.user.role.toLowerCase();

      // Check if user is accessing their role-specific routes
      if (path.startsWith(`/${role}`)) {
        return NextResponse.next();
      }

      // Redirect to appropriate dashboard based on role
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};