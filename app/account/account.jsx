'use client';

import { useEffect, useState } from 'react';

export default function Account() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetch('/api/auth/me').then((r) => r.json());
        if (!me.user) {
          window.location.href = '/login';
          return;
        }
        setUser(me.user);
        const o = await fetch('/api/orders').then((r) => r.json());
        setOrders(o.orders || []);
      } catch {
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  if (loading) return <div className="fb-auth-wrap"><div className="fb-auth-card"><p>Loading…</p></div></div>;

  return (
    <div className="fb-auth-wrap fb-account-wrap">
      <div className="fb-auth-card">
        <span className="fb-auth-kicker">My account</span>
        <h1>Hello, {user.name}</h1>
        <p className="fb-auth-sub">{user.email}</p>
        <button className="fb-auth-ghost" onClick={logout}>Logout</button>
      </div>
      <div className="fb-auth-card">
        <h2>My Orders</h2>
        {!orders.length ? (
          <p className="fb-auth-sub">No orders yet. <a href="/shop">Browse software</a></p>
        ) : (
          <div className="fb-order-list">
            {orders.map((o) => (
              <div className="fb-order-row" key={o.order_code}>
                <div>
                  <strong>{o.order_code}</strong>
                  <span className={'fb-order-status st-' + o.status}>{o.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="fb-order-meta">${Number(o.amount).toLocaleString()} • {new Date(o.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
