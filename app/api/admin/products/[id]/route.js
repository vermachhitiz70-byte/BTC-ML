import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

export async function PATCH(req, { params }) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const id = Number((await params).id);
  const body = await req.json().catch(() => ({}));
  const fields = ['name', 'short_desc', 'new_price', 'old_price', 'image', 'badge', 'active', 'status', 'sort_order'];
  const sets = [];
  const args = [];
  for (const f of fields) {
    if (body[f] !== undefined) {
      sets.push(f + ' = ?');
      args.push(['new_price', 'old_price', 'sort_order', 'active'].includes(f) ? Number(body[f]) || 0 : String(body[f]));
    }
  }
  if (!sets.length) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  sets.push("updated_at = datetime('now')");
  args.push(id);
  await db.execute({ sql: 'UPDATE products SET ' + sets.join(', ') + ' WHERE id = ?', args });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const id = Number((await params).id);
  await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] });
  return NextResponse.json({ ok: true });
}
