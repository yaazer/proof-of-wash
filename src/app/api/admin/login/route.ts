import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get('password') as string;
  const secret = process.env.ADMIN_SECRET;

  const loginUrl = new URL('/admin/login?error=1', request.url);
  const adminUrl = new URL('/admin', request.url);

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
