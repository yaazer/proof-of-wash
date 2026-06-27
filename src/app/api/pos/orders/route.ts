import { NextRequest, NextResponse } from 'next/server';
import { appendOrder, readOrders, type POSOrder } from '@/lib/posOrders';
import { decrementStock } from '@/lib/productsDb';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  return NextResponse.json(readOrders());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const order: POSOrder = {
    ...body,
    id: `pos-${uuidv4()}`,
    createdAt: new Date().toISOString(),
  };
  appendOrder(order);

  for (const item of order.items) {
    decrementStock(item.productId, item.variantId, item.quantity);
  }

  return NextResponse.json({ ok: true, id: order.id });
}
