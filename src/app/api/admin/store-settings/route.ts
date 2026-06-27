import { NextRequest, NextResponse } from 'next/server';
import { readSettings, writeSettings } from '@/lib/storeSettings';

export async function GET() {
  return NextResponse.json(readSettings());
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const current = readSettings();
  const updated = {
    storeSuspended:
      typeof body.storeSuspended === 'boolean' ? body.storeSuspended : current.storeSuspended,
    suspensionMessage:
      typeof body.suspensionMessage === 'string'
        ? body.suspensionMessage
        : current.suspensionMessage,
  };
  writeSettings(updated);
  return NextResponse.json({ ok: true, settings: updated });
}
