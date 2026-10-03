'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Input, Textarea, Select, Label, Card, Modal, Chip } from './ui';
import { ImageInput } from './ImageInput';
import { RichTextEditor } from './RichTextEditor';
import { Plus, Search, Trash, Pencil, X, CheckCheck, Image as IconImage } from 'lucide-react';

export function formatDate(v) {
  if (!v) return '—';
  const d = new Date(String(v).replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

export function money(v) {
  const n = Number(v || 0);
  return '$' + n.toLocaleString();
}

const STATUS_CHIP = {
  active: 'green',
  confirmed: 'green',
  read: 'green',
  coming_soon: 'amber',
  pending_verification: 'amber',
  pending: 'amber',
  draft: 'slate',
  rejected: 'red',
  unread: 'red',
  closed: 'slate',
  open: 'blue',
};

export function StatusChip({ value }) {
  const v = String(value ?? '—');
  return <Chip color={STATUS_CHIP[v] || 'slate'}>{v.replace(/_/g, ' ')}</Chip>;
}

function SearchBox({ value, onChange }) {
  return (
    <div className="adm-search">
      <span className="adm-search-ic"><Search size={16} /></span>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        aria-label="Search"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} className="adm-search-clear" aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

function DeleteConfirm({ id, onClose, onConfirm, busy, what }) {
  return (
    <Modal open={id != null} onClose={onClose} title="Confirm Delete">
      <p className="adm-muted" style={{ margin: '0 0 20px' }}>
        Are you sure you want to delete {what || 'this item'}? This cannot be undone.
      </p>
      <div className="adm-modal-foot" style={{ padding: 0 }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => onConfirm(id)} disabled={busy}>
          {busy ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}

function matchesSearch(item, q) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return Object.values(item).some((v) => v != null && String(v).toLowerCase().includes(needle));
}

function ProductForm({ fields, editing, setEditing, onSubmit, saving, onClose }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="adm-form-grid">
        {fields.map((f) => (
          <div key={f.name} className={f.type === 'textarea' || f.type === 'richtext' || f.type === 'image' ? 'adm-span2' : ''}>
            <Label>{f.label}{f.required ? ' *' : ''}</Label>
            {f.type === 'textarea' ? (
              <Textarea rows={4} value={String(editing[f.name] ?? '')} required={!!f.required}
                onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })} placeholder={f.placeholder} />
            ) : f.type === 'richtext' ? (
              <RichTextEditor value={String(editing[f.name] ?? '')} onChange={(html) => setEditing({ ...editing, [f.name]: html })} />
            ) : f.type === 'image' ? (
              <ImageInput value={String(editing[f.name] ?? '')} onChange={(v) => setEditing({ ...editing, [f.name]: v })} label={f.label} />
            ) : f.type === 'select' ? (
              <Select value={String(editing[f.name] ?? '')} onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}>
                <option value="">—</option>
                {f.options?.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
              </Select>
            ) : f.type === 'checkbox' ? (
              <label className="adm-checkrow">
                <input type="checkbox" checked={Number(editing[f.name]) === 1}
                  onChange={(e) => setEditing({ ...editing, [f.name]: e.target.checked ? 1 : 0 })} />
                Enabled
              </label>
            ) : (
              <Input
                type={f.type === 'number' ? 'number' : 'text'}
                value={String(editing[f.name] ?? '')}
                required={!!f.required}
                onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}
      </div>
      <div className="adm-form-actions">
        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </form>
  );
}

/* ================= PRODUCTS ================= */
export function ProductsManager({ fields }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load products');
      const json = await res.json();
      return json.products || [];
    },
  });

  const save = useMutation({
    mutationFn: async (form) => {
      const { id, ...payload } = form;
      payload.new_price = Number(payload.new_price) || 0;
      payload.old_price = Number(payload.old_price) || 0;
      payload.sort_order = Number(payload.sort_order) || 0;
      const method = id ? 'PATCH' : 'POST';
      const url = id ? `/api/admin/products/${id}` : '/api/admin/products';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Save failed');
      }
    },
    onSuccess: () => { toast.success('Product saved'); qc.invalidateQueries({ queryKey: ['admin-products'] }); setOpen(false); },
    onError: (e) => toast.error(String(e.message || e)),
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => { toast.success('Product deleted'); qc.invalidateQueries({ queryKey: ['admin-products'] }); setDeleteId(null); },
    onError: (e) => toast.error(String(e.message || e)),
  });

  const items = (data || []).filter((p) => matchesSearch(p, search));

  function blank() {
    const init = {};
    for (const f of fields) init[f.name] = f.type === 'checkbox' ? 0 : '';
    return init;
  }

  function submit(e) {
    e.preventDefault();
    if (editing) save.mutate(editing);
  }

  return (
    <div>
      <div className="adm-pagehead">
        <div>
          <h2>Products</h2>
          <p>{(data || []).length} product{(data || []).length !== 1 ? 's' : ''} in catalogue</p>
        </div>
        <Button onClick={() => { setEditing(blank()); setOpen(true); }}>
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {(data || []).length > 3 && <SearchBox value={search} onChange={setSearch} />}

      <Card className="adm-table-card">
        {isLoading ? (
          <div className="adm-table-empty">Loading products…</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 72 }}>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th className="adm-th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.image ? (
                        <img src={String(p.image).startsWith('/') ? p.image : `/assets/images/products/${p.image}`} alt=""
                          className="adm-thumb" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <span className="adm-thumb adm-thumb--empty"><IconImage size={20} /></span>
                      )}
                    </td>
                    <td>
                      <div className="adm-cell-main">{p.name}</div>
                      <div className="adm-cell-sub">{p.slug}</div>
                    </td>
                    <td>
                      <div className="adm-cell-main">{money(p.new_price)}</div>
                      {Number(p.old_price) !== Number(p.new_price) && (
                        <div className="adm-cell-sub"><s>{money(p.old_price)}</s></div>
                      )}
                    </td>
                    <td><StatusChip value={p.status || 'active'} /></td>
                    <td>{p.sort_order ?? 0}</td>
                    <td className="adm-td-right">
                      <div className="adm-row-actions">
                        <button type="button" className="adm-iconbtn" title="Edit product"
                          onClick={() => { setEditing({ ...p }); setOpen(true); }}>
                          <Pencil size={16} />
                        </button>
                        <button type="button" className="adm-iconbtn adm-iconbtn--danger" title="Delete product"
                          onClick={() => setDeleteId(p.id)}>
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="adm-table-empty">{search ? 'No products match your search.' : 'No products yet.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <DeleteConfirm id={deleteId} onClose={() => setDeleteId(null)} busy={remove.isPending}
        what="this product" onConfirm={(id) => remove.mutate(id)} />

      <Modal open={open} onClose={() => setOpen(false)} title={editing?.id ? 'Edit Product' : 'New Product'} wide>
        {editing && (
          <ProductForm fields={fields} editing={editing} setEditing={setEditing}
            onSubmit={submit} saving={save.isPending} onClose={() => setOpen(false)} />
        )}
      </Modal>
    </div>
  );
}

/* ================= ORDERS ================= */
export function OrdersManager() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load orders');
      const json = await res.json();
      return json.orders || [];
    },
  });

  const save = useMutation({
    mutationFn: async ({ id, status, admin_note }) => {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, admin_note }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Update failed');
      }
    },
    onSuccess: () => { toast.success('Order updated'); qc.invalidateQueries({ queryKey: ['admin-orders'] }); setOpen(false); },
    onError: (e) => toast.error(String(e.message || e)),
  });

  const items = (data || []).filter((o) => matchesSearch(o, search));

  function submit(e) {
    e.preventDefault();
    if (editing) save.mutate(editing);
  }

  return (
    <div>
      <div className="adm-pagehead">
        <div>
          <h2>Orders</h2>
          <p>{(data || []).length} order{(data || []).length !== 1 ? 's' : ''} — verify payment, then confirm</p>
        </div>
      </div>

      {(data || []).length > 0 && <SearchBox value={search} onChange={setSearch} />}

      <Card className="adm-table-card">
        {isLoading ? (
          <div className="adm-table-empty">Loading orders…</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="adm-th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <div className="adm-cell-main">{o.order_code}</div>
                      <div className="adm-cell-sub">{o.product_slug} &bull; {o.coin}</div>
                    </td>
                    <td>
                      <div className="adm-cell-main">{o.customer_name}</div>
                      <div className="adm-cell-sub">{o.customer_email}{o.phone ? ` • ${o.phone}` : ''}</div>
                    </td>
                    <td><div className="adm-cell-main">{money(o.amount)}</div></td>
                    <td><StatusChip value={o.status} /></td>
                    <td>{formatDate(o.created_at)}</td>
                    <td className="adm-td-right">
                      <div className="adm-row-actions">
                        <button type="button" className="adm-iconbtn" title="Verify / update order"
                          onClick={() => { setEditing({ id: o.id, status: o.status, admin_note: o.admin_note || '' }); setOpen(true); }}>
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="adm-table-empty">{search ? 'No orders match your search.' : 'No orders yet.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Verify Order">
        {editing && (
          <form onSubmit={submit}>
            <div className="adm-form" style={{ marginBottom: 20 }}>
              <div>
                <Label>Payment Status</Label>
                <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                  <option value="pending_verification">Pending verification</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>
              <div>
                <Label>Admin Note</Label>
                <Textarea rows={4} value={editing.admin_note}
                  onChange={(e) => setEditing({ ...editing, admin_note: e.target.value })}
                  placeholder="e.g. TX verified on BscScan, licence sent by email" />
              </div>
            </div>
            <div className="adm-form-actions">
              <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save'}</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

/* ================= LEADS ================= */
export function LeadsManager() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const res = await fetch('/api/admin/leads', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load leads');
      const json = await res.json();
      return json.leads || [];
    },
  });

  const mark = useMutation({
    mutationFn: async ({ id, read, all }) => {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(all ? { mark_all_read: true } : { id, read }),
      });
      if (!res.ok) throw new Error('Update failed');
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-leads'] }); },
    onError: (e) => toast.error(String(e.message || e)),
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => { toast.success('Lead deleted'); qc.invalidateQueries({ queryKey: ['admin-leads'] }); setDeleteId(null); },
    onError: (e) => toast.error(String(e.message || e)),
  });

  const items = (data || []).filter((l) => matchesSearch(l, search));
  const unread = (data || []).filter((l) => !l.read).length;

  return (
    <div>
      <div className="adm-pagehead">
        <div>
          <h2>Chatbot Leads</h2>
          <p>{(data || []).length} lead{(data || []).length !== 1 ? 's' : ''}{unread ? ` • ${unread} unread` : ''}</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={() => mark.mutate({ all: true })}>
            <CheckCheck size={15} /> Mark all read
          </Button>
        )}
      </div>

      {(data || []).length > 3 && <SearchBox value={search} onChange={setSearch} />}

      <Card className="adm-table-card">
        {isLoading ? (
          <div className="adm-table-empty">Loading leads…</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Page</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="adm-th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((l) => (
                  <tr key={l.id} style={l.read ? undefined : { background: '#fffbeb' }}>
                    <td><div className="adm-cell-main">{l.name || '—'}</div></td>
                    <td>
                      <div className="adm-cell-main" style={{ fontWeight: 500 }}>{l.email || '—'}</div>
                      {l.phone && <div className="adm-cell-sub">{l.phone}</div>}
                    </td>
                    <td>{l.page || '—'}</td>
                    <td>{l.read ? <Chip color="green">Read</Chip> : <Chip color="amber">Unread</Chip>}</td>
                    <td>{formatDate(l.created_at)}</td>
                    <td className="adm-td-right">
                      <div className="adm-row-actions">
                        <button type="button" className="adm-iconbtn adm-iconbtn--ok" title={l.read ? 'Mark unread' : 'Mark read'}
                          onClick={() => mark.mutate({ id: l.id, read: l.read ? 0 : 1 })}>
                          <CheckCheck size={16} />
                        </button>
                        <button type="button" className="adm-iconbtn adm-iconbtn--danger" title="Delete lead"
                          onClick={() => setDeleteId(l.id)}>
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="adm-table-empty">{search ? 'No leads match your search.' : 'No leads yet.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <DeleteConfirm id={deleteId} onClose={() => setDeleteId(null)} busy={remove.isPending}
        what="this lead" onConfirm={(id) => remove.mutate(id)} />
    </div>
  );
}
