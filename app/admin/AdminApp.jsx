'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  LayoutDashboard, Package, ShoppingBag, MessageSquare, Users,
  Settings, ChevronLeft, ChevronRight, Database, ExternalLink,
  LogOut, Eye, EyeOff
} from 'lucide-react';
import { Button, Select } from './ui';
import { Overview } from './Overview';
import { ProductsManager, OrdersManager, LeadsManager } from './ResourceManager';
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

const NAV = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, tile: 'adm-nav-tile--blue', sub: 'Store performance at a glance' },
  { id: 'products', label: 'Products', icon: Package, tile: 'adm-nav-tile--emerald', sub: 'Catalogue, pricing & availability' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, tile: 'adm-nav-tile--amber', sub: 'Verify payments & fulfil orders' },
  { id: 'leads', label: 'Leads', icon: Users, tile: 'adm-nav-tile--purple', sub: 'Contact & chatbot enquiries' },
  { id: 'chat', label: 'Live Chat', icon: MessageSquare, tile: 'adm-nav-tile--pink', sub: 'Reply to visitors in real time' },
  { id: 'settings', label: 'Settings', icon: Settings, tile: 'adm-nav-tile--slate', sub: 'Payments, password & site config' },
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
  const [brandBroken, setBrandBroken] = useState(false);

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
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { setAuthed(true); toast.success('Welcome back'); }
      else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || 'Invalid password');
      }
    } catch {
      toast.error('Login failed. Check your connection.');
    } finally {
      setLogging(false);
    }
  }

  function logout() {
    fetch('/api/admin/check', { method: 'DELETE' }).finally(() => { setAuthed(false); qc.clear(); });
  }

  if (authed === null) {
    return (
      <div className="adm-loading">
        <div>
          <div className="adm-loading-mark"><Package size={32} /></div>
          <h1>BTCMLTAI</h1>
          <p>Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="adm-login">
        <div id="particles-bg" />
        <div className="adm-login-card">
          <div className="adm-login-logo">
            {logoBroken ? (
              <div className="adm-login-fallback"><Package size={40} /></div>
            ) : (
              <img
                src="/assets/images/btcmlai-logo.png"
                alt="BTCMLTAI"
                onError={() => setLogoBroken(true)}
              />
            )}
          </div>
          <h1 className="adm-login-title">BTCMLTAI</h1>
          <p className="adm-login-sub">ADMIN PANEL</p>
          <form onSubmit={login}>
            <div className="adm-field">
              <div className="adm-pw-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  autoComplete="current-password"
                  className="adm-input adm-input--lg"
                  aria-label="Admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="adm-eye"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="gold" block disabled={logging}>
              {logging ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
          <p className="adm-hint">
            Default password: <code>VdxixXoXmfcz</code>
          </p>
        </div>
      </div>
    );
  }

  const active = NAV.find((n) => n.id === tab);

  return (
    <div className={collapsed ? 'adm-shell adm-shell--collapsed' : 'adm-shell'}>
      <div id="particles-bg" />

      <aside className="adm-sidebar" aria-label="Admin navigation">
        <div className="adm-brand">
          <div className="adm-brand-logo">
            {brandBroken ? (
              <Package size={20} />
            ) : (
              <img src="/assets/images/btcmlai-logo.png" alt="BTCMLTAI" onError={() => setBrandBroken(true)} />
            )}
          </div>
          {!collapsed && (
            <span className="adm-brand-name">BTCMLTAI<small>ADMIN</small></span>
          )}
        </div>

        <nav className="adm-nav">
          {NAV.map((n) => {
            const Icon = n.icon;
            const isActive = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={isActive ? 'adm-nav-item is-active' : 'adm-nav-item'}
                title={collapsed ? n.label : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={`adm-nav-tile ${n.tile}`}>
                  <Icon size={17} />
                </span>
                {!collapsed && <span className="adm-nav-label">{n.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="adm-side-foot">
          <button onClick={() => setCollapsed(!collapsed)} className="adm-side-btn" title={collapsed ? 'Expand' : 'Collapse'}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button onClick={seed} className="adm-side-btn" title="Seed Database">
            <Database size={18} />
            {!collapsed && <span>Seed Database</span>}
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="adm-side-btn" title="View Site">
            <ExternalLink size={18} />
            {!collapsed && <span>View Site</span>}
          </a>
          <button onClick={logout} className="adm-side-btn adm-side-btn--danger" title="Logout">
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <div>
            <h2 className="adm-topbar-title">{active?.label}</h2>
            <p className="adm-topbar-sub">{active?.sub}</p>
          </div>
          <div className="adm-topbar-actions">
            <a href="/" target="_blank" rel="noreferrer" className="adm-viewsite">
              <ExternalLink size={15} /> <span>View Site</span>
            </a>
          </div>
        </header>

        <div className="adm-mobilebar">
          <Select value={tab} onChange={(e) => setTab(e.target.value)} aria-label="Admin section">
            {NAV.map((n) => (<option key={n.id} value={n.id}>{n.label}</option>))}
          </Select>
        </div>

        <main className="adm-content">
          {tab === 'overview' && <Overview onNavigate={setTab} />}
          {tab === 'products' && <ProductsManager fields={PRODUCT_FIELDS} />}
          {tab === 'orders' && <OrdersManager />}
          {tab === 'leads' && <LeadsManager />}
          {tab === 'chat' && <ChatPanel />}
          {tab === 'settings' && <SettingsPanel />}
        </main>
      </div>
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
