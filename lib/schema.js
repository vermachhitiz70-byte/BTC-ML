import { dbEnabled, getDb } from './turso';

const TABLES = [
  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_desc TEXT DEFAULT '',
    new_price REAL NOT NULL DEFAULT 0,
    old_price REAL NOT NULL DEFAULT 0,
    image TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_slug TEXT DEFAULT '',
    customer_name TEXT DEFAULT '',
    customer_email TEXT DEFAULT '',
    amount REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    subject TEXT DEFAULT '',
    body TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT DEFAULT '',
    image TEXT DEFAULT '',
    published INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT '',
    email TEXT UNIQUE,
    password_hash TEXT DEFAULT '',
    role TEXT DEFAULT 'user',
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER,
    expires_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS chat_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    page TEXT DEFAULT '',
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_name TEXT DEFAULT '',
    visitor_email TEXT DEFAULT '',
    status TEXT DEFAULT 'open',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    convo_id INTEGER,
    sender TEXT DEFAULT 'visitor',
    text TEXT DEFAULT '',
    seen INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  )`,
  `CREATE TABLE IF NOT EXISTS presence (
    key TEXT PRIMARY KEY,
    value TEXT DEFAULT ''
  )`,
];

const EXTRA_COLUMNS = {
  products: [
    'short_desc TEXT DEFAULT \'\'',
    'badge TEXT DEFAULT \'\'',
    'active INTEGER NOT NULL DEFAULT 1',
    'sort_order INTEGER NOT NULL DEFAULT 0',
    'status TEXT DEFAULT \'active\'',
    'image TEXT DEFAULT \'\'',
    'old_price REAL DEFAULT 0',
  ],
  orders: [
    'phone TEXT DEFAULT \'\'',
    'coin TEXT DEFAULT \'\'',
    'tx_hash TEXT DEFAULT \'\'',
    'screenshot TEXT DEFAULT \'\'',
    'items TEXT DEFAULT \'\'',
    'order_code TEXT DEFAULT \'\'',
    'admin_note TEXT DEFAULT \'\'',
    'updated_at TEXT DEFAULT \'\'',
  ],
};

let ready = null;

export function ensureSchema() {
  if (!dbEnabled) return Promise.resolve();
  if (!ready) {
    ready = (async () => {
      const db = getDb();
      for (const ddl of TABLES) await db.execute(ddl);
      for (const [table, cols] of Object.entries(EXTRA_COLUMNS)) {
        let existing = [];
        try {
          const rs = await db.execute(`PRAGMA table_info(${table})`);
          existing = rs.rows.map((r) => String(r.name).toLowerCase());
        } catch {
          continue;
        }
        if (!existing.length) continue;
        for (const col of cols) {
          const name = col.split(' ')[0].toLowerCase();
          if (!existing.includes(name)) {
            try {
              await db.execute(`ALTER TABLE ${table} ADD COLUMN ${col}`);
            } catch {
              /* column already added concurrently */
            }
          }
        }
      }
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}
