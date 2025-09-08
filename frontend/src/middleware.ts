import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const sessionId = req.cookies.get('sessionId')?.value || null;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/user/login') || pathname.startsWith('/user/signup')) {
    if (sessionId) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    if (!sessionId) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/user/login', '/user/signup', '/dashboard/:path*']
};
