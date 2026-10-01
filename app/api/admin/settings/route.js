import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const rs = await db.execute({ sql: 'SELECT key, value FROM settings' });
  return NextResponse.json({ settings: Object.fromEntries(rs.rows.map((r) => [r.key, r.value])) });
}

export async function POST(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  const entries = Object.entries(body).filter(([k, v]) => typeof k === 'string' && typeof v === 'string' && k.length < 60 && v.length < 4000);
  for (const [k, v] of entries) {
    await db.execute({ sql: 'INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', args: [k, v] });
  }
  return NextResponse.json({ ok: true, saved: entries.length });
}
