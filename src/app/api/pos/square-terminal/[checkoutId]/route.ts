import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, ApiError } from 'square';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN ?? '',
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ checkoutId: string }> },
) {
  try {
    const { checkoutId } = await params;
    const response = await client.terminalApi.getTerminalCheckout(checkoutId);
    const checkout = response.result.checkout;
    return NextResponse.json({ status: checkout?.status, paymentIds: checkout?.paymentIds });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.errors?.[0]?.detail }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ checkoutId: string }> },
) {
  try {
    const { checkoutId } = await params;
    await client.terminalApi.cancelTerminalCheckout(checkoutId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.errors?.[0]?.detail }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
