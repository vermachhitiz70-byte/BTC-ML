'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  LayoutDashboard, Package, ShoppingBag, MessageSquare, Users,
  FileText, Settings, ChevronLeft, ChevronRight, Database, ExternalLink,
  LogOut, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { Button, Card, Modal } from './ui';
import { Overview } from './Overview';
import { ResourceManager } from './ResourceManager';
import { SettingsPanel } from './Settings';
import { ChatPanel } from './ChatPanel';
import { AdminProviders } from './Providers';

const PRODUCT_FIELDS = [
  { name: 'slug', label: 'Slug', required: true, placeholder: 'btc-mlt-ai' },
  { name: 'name', label: 'Product Name', required: true },
  { name: 'short_desc', label: 'Short Description', type: 'textarea' },
  { name: 'new_price', label: 'Price', type: 'number', placeholder: '1500' },
  { name: 'old_price', label: 'Original Price', type: 'number', placeholder: '1500' },
  { name: 'image', label: 'Featured Image', type: 'image' },
  { name: 'badge', label: 'Badge', placeholder: 'Best Seller / Coming Soon' },
  { name: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'coming_soon', label: 'Coming Soon' },
    { value: 'draft', label: 'Draft' },
  ]},
  { name: 'sort_order', label: 'Sort Order', type: 'number', placeholder: '0' },
];

const ORDER_COLUMNS = [
  { key: 'order_code', label: 'Order Code' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Date' },
];

const LEAD_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'page', label: 'Page' },
  { key: 'created_at', label: 'Date' },
  { key: 'read', label: 'Read' },
];

const NAV = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-600' },
  { id: 'products', label: 'Products', icon: Package, color: 'from-emerald-500 to-green-600' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, color: 'from-amber-500 to-orange-600' },
  { id: 'leads', label: 'Leads', icon: Users, color: 'from-purple-500 to-violet-600' },
  { id: 'chat', label: 'Live Chat', icon: MessageSquare, color: 'from-pink-500 to-rose-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-slate-500 to-gray-600' },
];

function AdminContent() {
  const qc = useQueryClient();
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState('overview');
  const [password, setPassword] = useState('');
  const [logging, setLogging] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);

  useEffect(() => {
    fetch('/api/admin/check').then((r) => setAuthed(r.ok)).catch(() => setAuthed(false));
  }, []);

  async function seed() {
    const res = await fetch('/api/admin/seed', { method: 'POST' });
    if (res.ok) toast.success('Database seeded from current content');
    else toast.error('Seed failed');
  }

  async function login(e) {
    e.preventDefault();
    setLogging(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLogging(false);
    if (res.ok) { setAuthed(true); toast.success('Welcome back'); }
    else toast.error('Invalid password');
  }

  function logout() {
    fetch('/api/admin/check', { method: 'DELETE' }).finally(() => { setAuthed(false); qc.clear(); });
  }

  if (authed === null) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-600 via-blue-700 to-navy-800">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-blue-600 text-white animate-pulse">
            <Package size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white">BTCMLTAI</h1>
        <p className="mt-1 text-sm text-blue-200">Loading admin panel…</p>
      </div>
    </div>
  );

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-600 via-blue-700 to-navy-800 p-6">
        <div className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0f172a 100%)' }} />
        <div className="relative z-10 w-full max-w-sm">
          <Card className="p-8 bg-white/95 backdrop-blur shadow-2xl border-0 rounded-2xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center">
                {logoBroken ? (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-blue-600 text-white">
                    <Package size={40} />
                  </div>
                ) : (
                  <img
                    src="/assets/images/btcmlai-logo.png"
                    alt="BTCMLTAI"
                    style={{ width: 144, height: 144, objectFit: 'contain' }}
                    onError={() => setLogoBroken(true)}
                  />
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">BTCMLTAI</h1>
              <p className="mt-1 text-sm text-slate-500">Admin Panel</p>
            </div>
            <form onSubmit={login} className="space-y-4">
              <div className="relative">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoFocus
                    className="w-full rounded-lg border border-slate-300 bg-white px-12 py-3 text-base text-slate-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full shadow-lg shadow-navy-500/25 text-base py-3" disabled={logging}>
                {logging ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
            <p className="mt-6 text-center text-xs text-slate-400">
              Default: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">VdxixXoXmfcz</code>
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 -z-10" id="particles-bg"></div>

      <aside className={`${collapsed ? 'w-20' : 'w-64'} hidden flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-200 transition-all duration-300 lg:flex`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700/50">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-navy-500 to-blue-600 text-white shadow-lg shadow-navy-500/30">
            <Package size={18} />
          </div>
          {!collapsed && <span className="text-lg font-bold text-white">BTCMLTAI</span>}
        </div>
        <nav className="flex-1 space-y-1 px-3 mt-2">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active ? 'bg-white/10 text-white shadow-lg shadow-black/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                title={collapsed ? n.label : undefined}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? `bg-gradient-to-br ${n.color} shadow-md` : 'bg-slate-700/50'}`}>
                  <Icon size={16} />
                </div>
                {!collapsed && n.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-slate-700/50 p-3">
          <button onClick={() => setCollapsed(!collapsed)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && 'Collapse'}
          </button>
          <button onClick={seed} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <Database size={18} /> {!collapsed && 'Seed Database'}
          </button>
          <a href="/" target="_blank" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
            <ExternalLink size={18} /> {!collapsed && 'View Site'}
          </a>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400">
            <LogOut size={18} /> {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-xl px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{NAV.find((n) => n.id === tab)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
            <select value={tab} onChange={(e) => setTab(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm lg:hidden">
              {NAV.map((n) => (<option key={n.id} value={n.id}>{n.label}</option>))}
            </select>
          </div>
        </header>
        <main className="p-6">
          {tab === 'overview' && <Overview onNavigate={setTab} />}
          {tab === 'products' && <ResourceManager resource="products" title="Products" columns={[{ key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'new_price', label: 'Price' }, { key: 'status', label: 'Status' }]} fields={PRODUCT_FIELDS} addLabel="Add Product" />}
          {tab === 'orders' && <ResourceManager resource="orders" title="Orders" columns={ORDER_COLUMNS} fields={[]} addLabel="" />}
          {tab === 'leads' && <ResourceManager resource="leads" title="Chatbot Leads" columns={LEAD_COLUMNS} fields={[]} addLabel="" />}
          {tab === 'chat' && <ChatPanel />}
          {tab === 'settings' && <SettingsPanel />}
        </main>
      </div>

      <style jsx global>{`
        [data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AdminProviders>
      <AdminContent />
    </AdminProviders>
  );
}