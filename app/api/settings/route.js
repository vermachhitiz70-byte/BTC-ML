import { NextResponse } from 'next/server';
import { dbEnabled, getDb } from '@/lib/turso';

const PUBLIC_KEYS = ['pay_coin', 'pay_address', 'pay_qr', 'support_note'];

export async function GET() {
  const fallback = {
    pay_coin: 'USDT (BEP20)',
    pay_address: '0xYourBEP20WalletAddressHere',
    pay_qr: '/assets/images/bep20-qr-placeholder.svg',
    support_note: 'Our team will contact you within 2 to 3 hours.',
  };
  if (!dbEnabled) return NextResponse.json({ settings: fallback });
  try {
    const rs = await getDb().execute({
      sql: 'SELECT key, value FROM settings WHERE key IN (' + PUBLIC_KEYS.map(() => '?').join(',') + ')',
      args: PUBLIC_KEYS,
    });
    const settings = { ...fallback };
    for (const r of rs.rows) settings[r.key] = r.value;
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: fallback });
  }
}
