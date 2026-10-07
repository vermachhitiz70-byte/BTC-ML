'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CircleCheck, LogOut, Package, Receipt, ShoppingCart, User,
} from 'lucide-react';
import { AuthShell, AuthHead } from '../site/auth';
import { Btn, Card, Chip, EmptyState } from '../site/ui';

const STATUS = {
  pending_verification: { tone: 'amber', label: 'Pending verification' },
  confirmed: { tone: 'green', label: 'Confirmed' },
  rejected: { tone: 'red', label: 'Rejected' },
  pending: { tone: 'amber', label: 'Pending' },
};

function fmt(v) {
  if (!v) return '';
  const d = new Date(String(v).replace(' ', 'T') + 'Z');
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Account() {
  const [me, setMe] = useState(null);
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/auth/me', { cache: 'no-store' });
        const j = await r.json();
        if (!j.user) { window.location.href = '/login?next=%2Faccount'; return; }
        setMe(j.user);
        const o = await fetch('/api/orders', { cache: 'no-store' });
        const oj = await o.json();
        setOrders(oj.orders || []);
        setState('ready');
      } catch {
        window.location.href = '/login?next=%2Faccount';
      }
    })();
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  if (state === 'loading') {
    return (
      <div className="bs-container">
        <div className="bs-card bs-card--pad" style={{ maxWidth: 420, margin: '60px auto' }}>
          <p className="bs-note" style={{ textAlign: 'center' }}>Loading your account…</p>
        </div>
      </div>
    );
  }

  const total = orders.length;

  return (
    <AuthShell
      feats={[]}
      chip="Signed in"
      sideTitle={me ? me.name || 'Customer' : 'Customer'}
      sideText={me ? me.email : ''}
      head={<AuthHead icon={User}>My Account</AuthHead>}
      title="Your account"
      sub="Review your orders, payment status and digital delivery details."
      alt={<button type="button" onClick={logout} className="bs-btn bs-btn--ghost bs-btn--sm" style={{ marginTop: 6 }}>
        <LogOut size={15} aria-hidden="true" /> Log out
      </button>}
    >
      <div className="bs-stats" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 26 }}>
        <Card className="bs-stat">
          <span className="bs-tile bs-tile--blue"><Receipt size={20} aria-hidden="true" /></span>
          <div><b>{total}</b><p style={{ fontSize: 12.5 }}>Orders placed</p></div>
        </Card>
        <Card className="bs-stat">
          <span className="bs-tile bs-tile--gold"><Package size={20} aria-hidden="true" /></span>
          <div><b>Instant</b><p style={{ fontSize: 12.5 }}>Digital delivery</p></div>
        </Card>
      </div>

      <h3 style={{ margin: '0 0 14px', fontSize: 17, fontWeight: 800, color: 'var(--bs-heading)' }}>
        Order history
      </h3>

      {!total ? (
        <EmptyState icon={ShoppingCart} title="No orders yet" text="When you place an order it will appear here with its payment status.">
          <Btn href="/shop">Browse Software</Btn>
        </EmptyState>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {orders.map((o) => {
            const s = STATUS[o.status] || { tone: 'slate', label: String(o.status || '').replace(/_/g, ' ') };
            return (
              <Card key={o.order_code} pad={false} className="bs-card--hover" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="bs-mono" style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bs-heading)' }}>{o.order_code}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--bs-muted)', marginTop: 3 }}>
                      {o.product_slug} · {o.coin || 'USDT'} · {fmt(o.created_at)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <b style={{ fontSize: 16 }}>{'$'}{Number(o.amount || 0).toLocaleString()}</b>
                    <Chip tone={s.tone}>{s.label}</Chip>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="bs-alert bs-alert--info" style={{ marginTop: 22 }}>
        <CircleCheck size={17} aria-hidden="true" />
        <span>Need help with an order? Our support team replies within 2–3 hours.</span>
      </div>
      <div style={{ marginTop: 14, textAlign: 'center' }}>
        <Link href="/contact" className="bs-btn bs-btn--outline bs-btn--sm">Contact Support</Link>
      </div>
    </AuthShell>
  );
}