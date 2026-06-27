import { NextRequest, NextResponse } from 'next/server';

const BTCPAY_URL = process.env.NEXT_PUBLIC_BTCPAY_URL;
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID;
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY;

function notConfigured() {
  return NextResponse.json(
    { error: 'BTCPay is not configured. Set BTCPAY_* environment variables.' },
    { status: 500 },
  );
}

export async function POST(request: NextRequest) {
  if (!BTCPAY_URL || !BTCPAY_STORE_ID || !BTCPAY_API_KEY) return notConfigured();

  const { totalCents, note } = await request.json();
  if (!totalCents) return NextResponse.json({ error: 'Missing totalCents' }, { status: 400 });

  const payload = {
    amount: (totalCents / 100).toFixed(2),
    currency: 'USD',
    metadata: { orderId: `pow-pos-${Date.now()}`, note: note ?? 'Proof of Wash POS' },
    checkout: {
      speedPolicy: 'MediumSpeed',
      requiresRefundEmail: false,
      defaultPaymentMethod: 'BTC',
      expirationMinutes: 15,
    },
  };

  const res = await fetch(`${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `token ${BTCPAY_API_KEY}` },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error('[pos/btcpay] create error:', await res.text());
    return NextResponse.json({ error: 'BTCPay invoice creation failed.' }, { status: 502 });
  }

  const invoice = await res.json();
  return NextResponse.json({
    invoiceId: invoice.id,
    checkoutLink: invoice.checkoutLink,
    status: invoice.status,
  });
}

export async function GET(request: NextRequest) {
  if (!BTCPAY_URL || !BTCPAY_STORE_ID || !BTCPAY_API_KEY) return notConfigured();

  const invoiceId = request.nextUrl.searchParams.get('invoiceId');
  if (!invoiceId) return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 });

  const res = await fetch(
    `${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices/${invoiceId}`,
    { headers: { Authorization: `token ${BTCPAY_API_KEY}` } },
  );

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 502 });

  const invoice = await res.json();
  return NextResponse.json({ status: invoice.status });
}
