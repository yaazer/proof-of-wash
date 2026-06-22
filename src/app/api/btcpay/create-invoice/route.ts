import { NextRequest, NextResponse } from 'next/server';

const BTCPAY_URL = process.env.NEXT_PUBLIC_BTCPAY_URL;
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID;
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function POST(request: NextRequest) {
  if (!BTCPAY_URL || !BTCPAY_STORE_ID || !BTCPAY_API_KEY) {
    return NextResponse.json(
      { error: 'BTCPay is not configured on the server. Set BTCPAY_* environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { contact, totalCents, items } = body;

    if (!totalCents || !contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const totalUsd = (totalCents / 100).toFixed(2);

    const invoicePayload = {
      amount: totalUsd,
      currency: 'USD',
      metadata: {
        buyerName: `${contact.firstName} ${contact.lastName}`,
        buyerEmail: contact.email,
        buyerAddress1: contact.address,
        buyerCity: contact.city,
        buyerState: contact.state,
        buyerZip: contact.zip,
        buyerCountry: contact.country ?? 'US',
        itemCount: items?.length ?? 0,
        orderId: `pow-${Date.now()}`,
      },
      checkout: {
        speedPolicy: 'MediumSpeed', // require 1 confirmation
        redirectURL: `${SITE_URL}/order-confirmation?method=btcpay`,
        redirectAutomatically: true,
        requiresRefundEmail: false,
        defaultPaymentMethod: 'BTC',
        expirationMinutes: 15,
      },
      receipt: {
        enabled: true,
        showPayments: true,
      },
    };

    const res = await fetch(
      `${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${BTCPAY_API_KEY}`,
        },
        body: JSON.stringify(invoicePayload),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[btcpay/create-invoice] BTCPay error:', err);
      return NextResponse.json(
        { error: 'BTCPay invoice creation failed. Please try again.' },
        { status: 502 }
      );
    }

    const invoice = await res.json();

    return NextResponse.json({
      invoiceId: invoice.id,
      checkoutLink: invoice.checkoutLink,
      status: invoice.status,
    });
  } catch (error) {
    console.error('[btcpay/create-invoice]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
