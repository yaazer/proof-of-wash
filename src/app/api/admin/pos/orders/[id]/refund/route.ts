import { NextRequest, NextResponse } from 'next/server';
import { readOrders, markRefunded } from '@/lib/posOrders';
import { Client, Environment, ApiError } from 'square';
import { v4 as uuidv4 } from 'uuid';

const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN ?? '',
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = readOrders().find((o) => o.id === id);

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  if (order.refunded) return NextResponse.json({ error: 'Already refunded' }, { status: 409 });

  try {
    if (order.paymentMethod === 'cash') {
      markRefunded(id);
      return NextResponse.json({ ok: true, message: 'Return cash to customer.' });
    }

    if (order.paymentMethod === 'square-terminal') {
      if (!order.squareCheckoutId) {
        return NextResponse.json({ error: 'No Square checkout ID on record' }, { status: 400 });
      }
      if (!process.env.SQUARE_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Square not configured' }, { status: 500 });
      }

      // Look up the completed checkout to get its payment ID
      const checkoutRes = await squareClient.terminalApi.getTerminalCheckout(order.squareCheckoutId);
      const paymentId = checkoutRes.result.checkout?.paymentIds?.[0];
      if (!paymentId) {
        return NextResponse.json({ error: 'Could not retrieve payment ID from Square' }, { status: 502 });
      }

      const refundRes = await squareClient.refundsApi.refundPayment({
        idempotencyKey: uuidv4(),
        paymentId,
        amountMoney: { amount: BigInt(order.total), currency: 'USD' },
        reason: 'POS refund',
      });

      markRefunded(id);
      return NextResponse.json({
        ok: true,
        refundId: refundRes.result.refund?.id,
        status: refundRes.result.refund?.status,
        message: 'Card refund issued. Funds appear within 2–5 business days.',
      });
    }

    if (order.paymentMethod === 'btcpay') {
      const BTCPAY_URL = process.env.NEXT_PUBLIC_BTCPAY_URL;
      const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID;
      const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY;

      if (!BTCPAY_URL || !BTCPAY_STORE_ID || !BTCPAY_API_KEY) {
        return NextResponse.json({ error: 'BTCPay not configured' }, { status: 500 });
      }
      if (!order.btcInvoiceId) {
        return NextResponse.json({ error: 'No BTCPay invoice ID on record' }, { status: 400 });
      }

      const res = await fetch(
        `${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices/${order.btcInvoiceId}/refund`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `token ${BTCPAY_API_KEY}`,
          },
          body: JSON.stringify({
            name: 'Refund',
            paymentMethod: 'BTC',
            refundVariant: 'Fiat', // refund USD value at current BTC rate
          }),
        },
      );

      if (!res.ok) {
        const err = await res.text();
        console.error('[refund/btcpay]', err);
        return NextResponse.json({ error: 'BTCPay refund creation failed' }, { status: 502 });
      }

      const refund = await res.json();
      markRefunded(id);
      return NextResponse.json({
        ok: true,
        pullPaymentUrl: refund.viewLink ?? refund.pullPaymentUrl,
        message: 'Bitcoin refund created. Share the link with the customer.',
      });
    }

    return NextResponse.json({ error: 'Unknown payment method' }, { status: 400 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.errors?.[0]?.detail ?? 'Refund failed' }, { status: 400 });
    }
    console.error('[refund]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
