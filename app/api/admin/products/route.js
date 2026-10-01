import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const rs = await db.execute({
    sql: 'SELECT id, slug, name, short_desc, new_price, old_price, image, badge, active, status, sort_order FROM products ORDER BY sort_order, id',
  });
  return NextResponse.json({ products: rs.rows });
}

export async function POST(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const name = String(body.name || '').trim();
  if (!slug || !name) return NextResponse.json({ error: 'Slug and name are required.' }, { status: 400 });
  try {
    const rs = await db.execute({
      sql: 'INSERT INTO products(slug, name, short_desc, new_price, old_price, image, badge, active, status, sort_order) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        slug, name,
        String(body.short_desc || ''),
        Number(body.new_price) || 0, Number(body.old_price) || 0,
        String(body.image || ''), String(body.badge || ''),
        body.active === 0 ? 0 : 1,
        String(body.status || 'active'),
        Number(body.sort_order) || 0,
      ],
    });
    return NextResponse.json({ ok: true, id: Number(rs.lastInsertRowid) });
  } catch (e) {
    return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 });
  }
}
