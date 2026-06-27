import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, ApiError } from 'square';
import { v4 as uuidv4 } from 'uuid';

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN ?? '',
  environment: process.env.NODE_ENV === 'production' ? Environment.Production : Environment.Sandbox,
});

export async function POST(request: NextRequest) {
  try {
    const { amountCents, note } = await request.json();

    if (!amountCents) {
      return NextResponse.json({ error: 'Missing amountCents' }, { status: 400 });
    }
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Square is not configured. Set SQUARE_ACCESS_TOKEN.' }, { status: 500 });
    }
    if (!process.env.SQUARE_TERMINAL_DEVICE_ID) {
      return NextResponse.json({ error: 'No terminal configured. Set SQUARE_TERMINAL_DEVICE_ID.' }, { status: 500 });
    }

    const response = await client.terminalApi.createTerminalCheckout({
      idempotencyKey: uuidv4(),
      checkout: {
        amountMoney: {
          amount: BigInt(amountCents),
          currency: 'USD',
        },
        deviceOptions: {
          deviceId: process.env.SQUARE_TERMINAL_DEVICE_ID,
          tipSettings: { allowTipping: false },
          skipReceiptScreen: false,
        },
        note: note ?? 'Proof of Wash POS',
        paymentType: 'CARD_PRESENT',
      },
    });

    const checkout = response.result.checkout;
    return NextResponse.json({ checkoutId: checkout?.id, status: checkout?.status });
  } catch (error) {
    if (error instanceof ApiError) {
      const message = error.errors?.[0]?.detail ?? 'Terminal checkout failed';
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error('[pos/square-terminal]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
