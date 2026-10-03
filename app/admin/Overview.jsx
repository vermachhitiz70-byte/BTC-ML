'use client';

import { useQuery } from '@tanstack/react-query';
import { Sparkles, Package, MessageSquare, Users, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from './ui';

const CARDS = [
  { key: 'products', label: 'Products', icon: Package, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-600', tab: 'products' },
  { key: 'orders', label: 'Orders', icon: ShoppingBag, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-600', tab: 'orders' },
  { key: 'chat_leads', label: 'Chat Leads', icon: MessageSquare, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600', tab: 'chat' },
  { key: 'users', label: 'Users', icon: Users, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', text: 'text-purple-600', tab: 'leads' },
];

export function Overview({ onNavigate }) {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      if (!res.ok) return null;
      const d = await res.json();
      return d.stats;
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders?all=1&limit=5', { cache: 'no-store' });
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Welcome back</h2>
        <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your BTCMLTAI store.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {CARDS.map((c) => {
          const Icon = c.icon;
          const count = stats?.[c.key] ?? 0;
          return (
            <button key={c.key} onClick={() => onNavigate(c.tab)}
              className="group rounded-2xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-lg`}>
                  <Icon size={22} />
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500 transition mt-1" />
              </div>
              <div className="text-3xl font-bold text-slate-800">{count}</div>
              <div className="text-sm text-slate-500">{c.label}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Orders</h3>
          {recentOrders?.length ? (
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map((o) => (
                <div key={o.order_code} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                    <div className="flex h-full w-full items-center justify-center text-slate-400"><ShoppingBag size={16} /></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-slate-800 truncate">{o.order_code}</div>
                    <div className="text-xs text-slate-500 truncate">{o.customer_name} • ${Number(o.amount).toLocaleString()}</div>
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                    {o.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No orders yet.</p>
          )}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-navy-500 to-blue-600 p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
          <p className="text-sm text-white/80 mb-4">Manage your store content from here.</p>
          <div className="space-y-2">
            {[
              { label: 'Add a new product', tab: 'products' },
              { label: 'View all orders', tab: 'orders' },
              { label: 'Check chat leads', tab: 'chat' },
              { label: 'Manage site content', tab: 'settings' },
            ].map((a) => (
              <button key={a.tab} onClick={() => onNavigate(a.tab)}
                className="flex w-full items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium hover:bg-white/25 transition"
              >
                <ArrowRight size={14} /> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}