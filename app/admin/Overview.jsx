'use client';

import { useQuery } from '@tanstack/react-query';
import { Package, MessageSquare, Users, ShoppingBag, ArrowRight } from 'lucide-react';

const CARDS = [
  { key: 'products', label: 'Products', icon: Package, tile: 'adm-stat-tile--blue', tab: 'products' },
  { key: 'orders', label: 'Orders', icon: ShoppingBag, tile: 'adm-stat-tile--emerald', tab: 'orders' },
  { key: 'chat_leads', label: 'Chat Leads', icon: MessageSquare, tile: 'adm-stat-tile--amber', tab: 'leads' },
  { key: 'users', label: 'Registered Users', icon: Users, tile: 'adm-stat-tile--purple', tab: null },
];

function formatDate(v) {
  if (!v) return '';
  const d = new Date(String(v).replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

export function Overview({ onNavigate }) {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const recentOrders = stats?.recent_orders || [];

  return (
    <div>
      <div className="adm-welcome">
        <h2>Welcome back</h2>
        <p>Here&apos;s what&apos;s happening with your BTCMLTAI store.</p>
      </div>

      <div className="adm-stats">
        {CARDS.map((c) => {
          const Icon = c.icon;
          const count = stats?.[c.key] ?? 0;
          const inner = (
            <>
              <div className="adm-stat-top">
                <div className={`adm-stat-tile ${c.tile}`}>
                  <Icon size={22} />
                </div>
                {c.tab ? <ArrowRight size={16} className="adm-stat-arrow" /> : null}
              </div>
              <div className="adm-stat-value">{Number(count).toLocaleString()}</div>
              <div className="adm-stat-label">{c.label}</div>
            </>
          );
          return c.tab ? (
            <button key={c.key} onClick={() => onNavigate(c.tab)} className="adm-stat" type="button">
              {inner}
            </button>
          ) : (
            <div key={c.key} className="adm-stat">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="adm-grid-2">
        <div className="adm-card adm-panel">
          <h3>Recent Orders</h3>
          <p className="adm-panel-sub">Latest payment-verification requests</p>
          {recentOrders.length ? (
            <div className="adm-recent-list">
              {recentOrders.slice(0, 5).map((o) => (
                <div key={o.order_code || o.id} className="adm-recent-row">
                  <div className="adm-recent-ic"><ShoppingBag size={16} /></div>
                  <div className="adm-recent-meta">
                    <div className="adm-recent-name">{o.order_code}</div>
                    <div className="adm-recent-sub">
                      {o.customer_name} &bull; ${Number(o.amount || 0).toLocaleString()} &bull; {formatDate(o.created_at)}
                    </div>
                  </div>
                  <span className={
                    o.status === 'confirmed' ? 'adm-chip adm-chip--green'
                    : o.status === 'rejected' ? 'adm-chip adm-chip--red'
                    : 'adm-chip adm-chip--amber'
                  }>
                    {String(o.status || 'pending').replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="adm-empty">No orders yet. New orders will appear here.</div>
          )}
        </div>

        <div className="adm-card adm-panel adm-quick">
          <h3>Quick Actions</h3>
          <p className="adm-panel-sub">Manage your store content from here.</p>
          <div className="adm-quick-list">
            {[
              { label: 'Add a new product', tab: 'products' },
              { label: 'Verify orders', tab: 'orders' },
              { label: 'Check chat leads', tab: 'leads' },
              { label: 'Reply to live chat', tab: 'chat' },
              { label: 'Payment settings', tab: 'settings' },
            ].map((a) => (
              <button key={a.tab} onClick={() => onNavigate(a.tab)} className="adm-quick-btn" type="button">
                <ArrowRight size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
