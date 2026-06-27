import { NextRequest, NextResponse } from 'next/server';
import { deleteOrder, readOrders } from '@/lib/posOrders';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const order = readOrders().find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  deleteOrder(id);
  return NextResponse.json({ ok: true });
}
