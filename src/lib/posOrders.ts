import fs from 'fs';
import path from 'path';

export interface POSOrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantLabel?: string;
  price: number;
  quantity: number;
}

export interface POSOrder {
  id: string;
  items: POSOrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: 'cash' | 'square-terminal' | 'btcpay';
  paymentStatus: 'completed' | 'cancelled';
  cashTendered?: number;
  changeDue?: number;
  squareCheckoutId?: string;
  btcInvoiceId?: string;
  createdAt: string;
  refunded?: boolean;
  refundedAt?: string;
}

const DATA_PATH = path.join(process.cwd(), 'src/data/pos-orders.json');

export function readOrders(): POSOrder[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) as POSOrder[];
  } catch {
    return [];
  }
}

export function writeOrders(orders: POSOrder[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(orders, null, 2));
}

export function appendOrder(order: POSOrder): void {
  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
}

export function deleteOrder(id: string): void {
  writeOrders(readOrders().filter((o) => o.id !== id));
}

export function markRefunded(id: string): void {
  writeOrders(
    readOrders().map((o) =>
      o.id === id ? { ...o, refunded: true, refundedAt: new Date().toISOString() } : o,
    ),
  );
}
