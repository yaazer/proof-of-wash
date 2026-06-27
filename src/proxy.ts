import { NextRequest, NextResponse } from 'next/server';

function getBase(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') ?? new URL(request.url).protocol.slice(0, -1);
  const host = request.headers.get('x-forwarded-host') ?? new URL(request.url).host;
  return `${proto}://${host}`;
}

function checkAuth(
  request: NextRequest,
  cookieName: string,
  secret: string | undefined,
  loginPath: string,
): NextResponse | null {
  const token = request.cookies.get(cookieName)?.value;
  if (!token || !secret || token !== secret) {
    const { pathname } = request.nextUrl;
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL(loginPath, getBase(request));
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes ──────────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (
      pathname === '/admin/login' ||
      pathname.startsWith('/api/admin/auth') ||
      pathname === '/api/admin/login'
    ) {
      return NextResponse.next();
    }
    return checkAuth(request, 'pow-admin', process.env.ADMIN_SECRET, '/admin/login') ?? NextResponse.next();
  }

  // ── POS routes ────────────────────────────────────────────────
  if (pathname.startsWith('/pos') || pathname.startsWith('/api/pos')) {
    if (pathname === '/pos/login' || pathname === '/api/pos/login' || pathname.startsWith('/api/pos/auth')) {
      return NextResponse.next();
    }
    const secret = process.env.POS_SECRET ?? process.env.ADMIN_SECRET;
    return checkAuth(request, 'pow-pos', secret, '/pos/login') ?? NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/pos/:path*', '/api/pos/:path*'],
};
