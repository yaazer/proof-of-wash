import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.BTCPAY_WEBHOOK_SECRET ?? '';

function verifySignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('BTCPay-Sig') ?? '';

  if (WEBHOOK_SECRET && !verifySignature(rawBody, signature.replace('sha256=', ''))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, invoiceId } = event as { type: string; invoiceId: string };

  switch (type) {
    case 'InvoiceSettled':
      // Payment confirmed — fulfill the order
      console.log(`[btcpay webhook] Invoice settled: ${invoiceId}`);
      // TODO: trigger fulfillment (send confirmation email, update order status, etc.)
      break;

    case 'InvoiceExpired':
      console.log(`[btcpay webhook] Invoice expired: ${invoiceId}`);
      break;

    case 'InvoiceInvalid':
      console.log(`[btcpay webhook] Invoice invalid: ${invoiceId}`);
      break;

    default:
      console.log(`[btcpay webhook] Unhandled event: ${type}`);
  }

  return NextResponse.json({ received: true });
}
