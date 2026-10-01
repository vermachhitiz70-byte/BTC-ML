'use client';

import { useEffect, useState } from 'react';

const TABS = ['dashboard', 'products', 'orders', 'leads', 'slides', 'testimonials', 'faqs', 'settings'];

async function api(path, opts) {
  const r = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...(opts || {}) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Request failed.');
  return j;
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load(t) {
    setBusy(true);
    try {
      if (t === 'dashboard') setData(await api('/api/admin/stats'));
      else if (t === 'products') setData(await api('/api/admin/products'));
      else if (t === 'orders') setData(await api('/api/orders?all=1'));
      else if (t === 'leads') setData(await api('/api/admin/leads'));
      else if (t === 'settings') setData(await api('/api/admin/settings'));
      else setData(await api('/api/admin/content/' + t));
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const me = await api('/api/auth/me');
        if (!me.user || me.user.role !== 'admin') { setLoading(false); return; }
        setUser(me.user);
        await load('dashboard');
      } catch { /* show login */ }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(e) {
    e.preventDefault();
    setErr('');
    try {
      const j = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (j.user.role !== 'admin') throw new Error('This account is not an admin.');
      setUser(j.user);
      await load('dashboard');
    } catch (e2) {
      setErr(e2.message);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  }

  function switchTab(t) {
    setTab(t);
    setData(null);
    setErr('');
    load(t);
  }

  if (loading) return <div className="fb-admin-wrap"><p>Loading…</p></div>;
  if (!user) {
    return (
      <div className="fb-admin-wrap">
        <div className="fb-admin-login">
          <h1>Admin Login</h1>
          <form onSubmit={login}>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            {err ? <div className="fb-admin-err">{err}</div> : null}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-admin-wrap">
      <div className="fb-admin-top">
        <h1>Admin Panel</h1>
        <div><span>{user.email}</span><button onClick={logout}>Logout</button></div>
      </div>
      <div className="fb-admin-tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => switchTab(t)}>{t}</button>
        ))}
      </div>
      {err ? <div className="fb-admin-err">{err}</div> : null}
      {busy ? <p>Loading…</p> : null}
      {tab === 'dashboard' && data && <Dashboard d={data} reload={() => load('dashboard')} />}
      {tab === 'products' && data && <Products d={data} reload={() => load('products')} />}
      {tab === 'orders' && data && <Orders d={data} reload={() => load('orders')} />}
      {tab === 'leads' && data && <Leads d={data} reload={() => load('leads')} />}
      {tab === 'settings' && data && <Settings d={data} />}
      {['slides', 'testimonials', 'faqs'].includes(tab) && data && <Generic table={tab} d={data} reload={() => load(tab)} />}
    </div>
  );
}

function Dashboard({ d }) {
  return (
    <div className="fb-admin-cards">
      {['orders', 'chat_leads', 'users', 'products', 'slides'].map((k) => (
        <div className="fb-admin-stat" key={k}><strong>{d[k] ?? 0}</strong><span>{k.replace(/_/g, ' ')}</span></div>
      ))}
      <div className="fb-admin-wide">
        <h3>Recent orders</h3>
        {(d.recent_orders || []).map((o) => (
          <div className="fb-admin-row" key={o.order_code}>
            <span><strong>{o.order_code}</strong> — {o.customer_name} — ${Number(o.amount).toLocaleString()}</span>
            <span className="fb-order-status">{o.status.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Products({ d, reload }) {
  const [f, setF] = useState({ slug: '', name: '', short_desc: '', new_price: '', old_price: '', image: '', badge: '', status: 'active', sort_order: '0' });
  async function add(e) {
    e.preventDefault();
    await api('/api/admin/products', { method: 'POST', body: JSON.stringify(f) });
    setF({ slug: '', name: '', short_desc: '', new_price: '', old_price: '', image: '', badge: '', status: 'active', sort_order: '0' });
    reload();
  }
  async function toggle(p) {
    await api('/api/admin/products/' + p.id, { method: 'PATCH', body: JSON.stringify({ active: p.active ? 0 : 1 }) });
    reload();
  }
  async function del(id) {
    if (!confirm('Delete this product?')) return;
    await api('/api/admin/products/' + id, { method: 'DELETE' });
    reload();
  }
  async function savePrice(p, field, val) {
    await api('/api/admin/products/' + p.id, { method: 'PATCH', body: JSON.stringify({ [field]: val }) });
    reload();
  }
  return (
    <div>
      <h3>Products</h3>
      {(d.products || []).map((p) => (
        <div className="fb-admin-row" key={p.id}>
          <span><strong>{p.name}</strong> <small>/{p.slug} • ${p.new_price} • {p.status} • {p.active ? 'on' : 'off'}</small></span>
          <span className="fb-admin-btns">
            <button onClick={() => { const v = prompt('New price for ' + p.name, p.new_price); if (v !== null) savePrice(p, 'new_price', v); }}>Price</button>
            <button onClick={() => { const v = prompt('Status (active/coming_soon/draft)', p.status); if (v !== null) savePrice(p, 'status', v); }}>Status</button>
            <button onClick={() => toggle(p)}>{p.active ? 'Hide' : 'Show'}</button>
            <button onClick={() => del(p.id)}>Delete</button>
          </span>
        </div>
      ))}
      <h3>Add product</h3>
      <form className="fb-admin-form" onSubmit={add}>
        <input placeholder="slug (e.g. my-ea-mt5)" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} />
        <input placeholder="Product name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input placeholder="Short description" value={f.short_desc} onChange={(e) => setF({ ...f, short_desc: e.target.value })} />
        <input placeholder="Price" value={f.new_price} onChange={(e) => setF({ ...f, new_price: e.target.value })} />
        <input placeholder="Old price" value={f.old_price} onChange={(e) => setF({ ...f, old_price: e.target.value })} />
        <input placeholder="Image path (/assets/images/products/x.png)" value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} />
        <input placeholder="Status: active/coming_soon/draft" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

function Orders({ d, reload }) {
  const [open, setOpen] = useState(null);
  async function setStatus(o, status) {
    const note = prompt('Admin note (optional)', o.admin_note || '') || '';
    await api('/api/admin/orders', { method: 'PATCH', body: JSON.stringify({ id: o.id, status, admin_note: note }) });
    reload();
  }
  return (
    <div>
      <h3>Orders ({(d.orders || []).length})</h3>
      {(d.orders || []).map((o) => (
        <div key={o.id}>
          <div className="fb-admin-row" onClick={() => setOpen(open === o.id ? null : o.id)} style={{ cursor: 'pointer' }}>
            <span><strong>{o.order_code}</strong> — {o.customer_name} — ${Number(o.amount).toLocaleString()}</span>
            <span className="fb-order-status">{o.status.replace(/_/g, ' ')}</span>
          </div>
          {open === o.id && (
            <div className="fb-admin-detail">
              <p><strong>Email:</strong> {o.customer_email} &nbsp; <strong>Phone:</strong> {o.phone}</p>
              <p><strong>Coin:</strong> {o.coin} &nbsp; <strong>Items:</strong> {o.items}</p>
              <p><strong>TX hash:</strong> <code>{o.tx_hash}</code></p>
              {o.screenshot ? <a href={o.screenshot} target="_blank" rel="noreferrer"><img src={o.screenshot} alt="Payment proof" className="fb-admin-shot" /></a> : <p>No screenshot.</p>}
              <p><strong>Note:</strong> {o.admin_note || '—'} &nbsp; <strong>Date:</strong> {o.created_at}</p>
              <div className="fb-admin-btns">
                <button onClick={() => setStatus(o, 'confirmed')}>Confirm</button>
                <button onClick={() => setStatus(o, 'rejected')}>Reject</button>
                <button onClick={() => setStatus(o, 'pending_verification')}>Pending</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Leads({ d, reload }) {
  async function markAll() {
    await api('/api/admin/leads', { method: 'PATCH', body: JSON.stringify({ mark_all_read: true }) });
    reload();
  }
  async function del(id) {
    await api('/api/admin/leads?id=' + id, { method: 'DELETE' });
    reload();
  }
  return (
    <div>
      <h3>Chatbot Leads ({(d.leads || []).length}) <button onClick={markAll}>Mark all read</button></h3>
      {(d.leads || []).map((l) => (
        <div className="fb-admin-row" key={l.id}>
          <span><strong>{l.name}</strong> — {l.email} — {l.phone} <small>{l.page} • {l.created_at} {l.read ? '' : '• NEW'}</small></span>
          <span className="fb-admin-btns"><button onClick={() => del(l.id)}>Delete</button></span>
        </div>
      ))}
    </div>
  );
}

function Settings({ d }) {
  const [f, setF] = useState(d.settings || {});
  const [msg, setMsg] = useState('');
  async function save(e) {
    e.preventDefault();
    await api('/api/admin/settings', { method: 'POST', body: JSON.stringify(f) });
    setMsg('Saved.');
  }
  return (
    <form className="fb-admin-form" onSubmit={save}>
      <h3>Payment Settings</h3>
      <label>Coin label<input value={f.pay_coin || ''} onChange={(e) => setF({ ...f, pay_coin: e.target.value })} /></label>
      <label>Wallet address<input value={f.pay_address || ''} onChange={(e) => setF({ ...f, pay_address: e.target.value })} /></label>
      <label>QR image path<input value={f.pay_qr || ''} onChange={(e) => setF({ ...f, pay_qr: e.target.value })} /></label>
      <label>Support note<input value={f.support_note || ''} onChange={(e) => setF({ ...f, support_note: e.target.value })} /></label>
      <button type="submit">Save Settings</button>
      {msg ? <p>{msg}</p> : null}
    </form>
  );
}

function Generic({ table, d, reload }) {
  const [f, setF] = useState({});
  const fields = { slides: ['image', 'title', 'link'], testimonials: ['name', 'text'], faqs: ['question', 'answer'] }[table] || [];
  async function add(e) {
    e.preventDefault();
    await api('/api/admin/content/' + table, { method: 'POST', body: JSON.stringify(f) });
    setF({});
    reload();
  }
  async function del(id) {
    if (!confirm('Delete?')) return;
    await api('/api/admin/content/' + table + '?id=' + id, { method: 'DELETE' });
    reload();
  }
  return (
    <div>
      <h3 style={{ textTransform: 'capitalize' }}>{table} ({(d.rows || []).length})</h3>
      {(d.rows || []).map((r) => (
        <div className="fb-admin-row" key={r.id}>
          <span>{r.title || r.name || r.question || ('#' + r.id)}</span>
          <span className="fb-admin-btns"><button onClick={() => del(r.id)}>Delete</button></span>
        </div>
      ))}
      <form className="fb-admin-form" onSubmit={add}>
        {fields.map((x) => (
          <input key={x} placeholder={x} value={f[x] || ''} onChange={(e) => setF({ ...f, [x]: e.target.value })} />
        ))}
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
