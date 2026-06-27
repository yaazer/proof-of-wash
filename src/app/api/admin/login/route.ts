import { NextRequest, NextResponse } from 'next/server';

// Build the correct base URL respecting reverse-proxy / tunnel headers so that
// the post-login redirect stays on the same external host (not localhost).
function getBase(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') ?? new URL(request.url).protocol.slice(0, -1);
  const host = request.headers.get('x-forwarded-host') ?? new URL(request.url).host;
  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get('password') as string;
  const secret = process.env.ADMIN_SECRET;

  const base = getBase(request);
  const loginUrl = new URL('/admin/login?error=1', base);
  const adminUrl = new URL('/admin', base);

  if (!secret || password !== secret) {
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(adminUrl, { status: 303 });
  response.cookies.set('pow-admin', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}
