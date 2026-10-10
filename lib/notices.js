import { dbEnabled, getDb } from './turso';
import { ensureSchema } from './schema';

const DEFAULT_NOTICES = [
  {
    image: '/assets/images/products/btcmlt-silver.png',
    title: 'Silver — Coming Soon',
    description: 'Our disciplined low-frequency Expert Advisor is in final testing. Join the early list for launch updates.',
    link_label: 'Notify Me',
    link_url: '/products/ict-silver-bullet-ea-mt4',
    sort_order: 1,
  },
  {
    image: '/assets/images/products/btcmlt-ai-2.png',
    title: 'BTC MLT AI with SetFiles',
    description: 'Automated BTCUSD trading on MT5 with trend filters and optimized conservative + standard settings.',
    link_label: 'View Product',
    link_url: '/products/btc-mlt-ai',
    sort_order: 2,
  },
  {
    image: '/assets/images/products/btcmlt-currency.png',
    title: 'Currency — 8 Pairs, One EA',
    description: 'Multi-currency automation with drawdown protection across 8 Forex pairs on H1.',
    link_label: 'View Product',
    link_url: '/products/currency',
    sort_order: 3,
  },
];

function normalize(row) {
  return {
    id: Number(row.id),
    image: String(row.image || ''),
    title: String(row.title || ''),
    description: String(row.description || ''),
    link_label: String(row.link_label || ''),
    link_url: String(row.link_url || ''),
    sort_order: Number(row.sort_order || 0),
    active: Number(row.active ?? 1),
  };
}

/** Active hero notices for the storefront (max 3). Seeds defaults on first run. */
export async function getNotices(limit = 3) {
  if (!dbEnabled) return DEFAULT_NOTICES.slice(0, limit).map((n, i) => ({ id: i + 1, active: 1, ...n }));
  await ensureSchema();
  const db = getDb();
  try {
    const count = await db.execute('SELECT COUNT(*) AS c FROM notices');
    if (Number(count.rows[0]?.c || 0) === 0) {
      for (const n of DEFAULT_NOTICES) {
        await db.execute({
          sql: 'INSERT INTO notices(image,title,description,link_label,link_url,sort_order,active) VALUES(?,?,?,?,?,?,1)',
          args: [n.image, n.title, n.description, n.link_label, n.link_url, n.sort_order],
        });
      }
    }
    const rs = await db.execute({
      sql: 'SELECT id,image,title,description,link_label,link_url,sort_order,active FROM notices WHERE active = 1 ORDER BY sort_order, id LIMIT ?',
      args: [limit],
    });
    return rs.rows.map(normalize);
  } catch {
    return [];
  }
}
