import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API through
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth') || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get('pow-admin')?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!token || !secret || token !== secret) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
