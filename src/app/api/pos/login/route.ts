import { NextRequest, NextResponse } from 'next/server';

function getBase(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') ?? new URL(request.url).protocol.slice(0, -1);
  const host = request.headers.get('x-forwarded-host') ?? new URL(request.url).host;
  return `${proto}://${host}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get('password') as string;
  const from = (formData.get('from') as string) || '/pos';
  const secret = process.env.POS_SECRET ?? process.env.ADMIN_SECRET;

  const base = getBase(request);

  if (!secret || password !== secret) {
    return NextResponse.redirect(new URL('/pos/login?error=1', base), { status: 303 });
  }

  const response = NextResponse.redirect(new URL(from, base), { status: 303 });
  response.cookies.set('pow-pos', secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return response;
}
