import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, ApiError } from 'square';
import { v4 as uuidv4 } from 'uuid';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN ?? '',
  environment:
    process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, amountCents, contact, items } = body;

    if (!token || !amountCents || !contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.SQUARE_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Square is not configured on the server. Set SQUARE_ACCESS_TOKEN.' },
        { status: 500 }
      );
    }

    const idempotencyKey = uuidv4();

    const response = await client.paymentsApi.createPayment({
      sourceId: token,
      idempotencyKey,
      amountMoney: {
        amount: BigInt(amountCents),
        currency: 'USD',
      },
      buyerEmailAddress: contact.email,
      shippingAddress: {
        addressLine1: contact.address,
        locality: contact.city,
        administrativeDistrictLevel1: contact.state,
        postalCode: contact.zip,
        country: 'US',
        firstName: contact.firstName,
        lastName: contact.lastName,
      },
      note: `Proof of Wash order — ${items?.length ?? 0} item(s)`,
    });

    const payment = response.result.payment;

    return NextResponse.json({
      paymentId: payment?.id,
      status: payment?.status,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      const message = error.errors?.[0]?.detail ?? 'Payment failed';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error('[square/create-payment]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
