import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const tables = ['orders', 'chat_leads', 'users', 'products', 'slides'];
  const out = {};
  for (const t of tables) {
    try {
      const rs = await db.execute({ sql: 'SELECT COUNT(*) AS n FROM "' + t + '"' });
      out[t] = rs.rows[0].n;
    } catch {
      out[t] = 0;
    }
  }
  const recent = await db.execute({
    sql: 'SELECT order_code, customer_name, amount, status, created_at FROM orders ORDER BY id DESC LIMIT 8',
  });
  out.recent_orders = recent.rows;
  return NextResponse.json(out);
}
