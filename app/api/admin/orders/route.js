import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const rs = await db.execute({
    sql: 'SELECT id, order_code, product_slug, customer_name, customer_email, amount, status, phone, coin, tx_hash, screenshot, items, admin_note, created_at FROM orders ORDER BY id DESC LIMIT 200',
  });
  return NextResponse.json({ orders: rs.rows });
}

export async function PATCH(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  const status = String(body.status || '');
  if (!id || !['pending_verification', 'confirmed', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid id or status.' }, { status: 400 });
  }
  await db.execute({
    sql: "UPDATE orders SET status = ?, admin_note = ?, updated_at = datetime('now') WHERE id = ?",
    args: [status, String(body.admin_note || ''), id],
  });
  return NextResponse.json({ ok: true });
}
