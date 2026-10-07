'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Card, Modal } from './ui';
import { Mail, Phone, Trash, CheckCheck, MailOpen } from 'lucide-react';

function fmt(v) {
  if (!v) return '—';
  const d = new Date(String(v).replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

export function MessagesManager() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState(null);
  const [delId, setDelId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const res = await fetch('/api/admin/messages', { cache: 'no-store' });
      if (!res.ok) return { messages: [] };
      const json = await res.json();
      return json;
    },
    refetchInterval: 10000,
  });

  const mark = useMutation({
    mutationFn: async (v) => {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v),
      });
      if (!res.ok) throw new Error('Update failed');
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-messages'] }),
    onError: (e) => toast.error(String(e.message || e)),
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      toast.success('Message deleted');
      setDelId(null);
      setOpenId(null);
      qc.invalidateQueries({ queryKey: ['admin-messages'] });
    },
    onError: (e) => toast.error(String(e.message || e)),
  });

  const list = data?.messages || [];
  const unread = list.filter((m) => !m.read).length;
  const current = list.find((m) => m.id === openId) || null;

  function open(m) {
    setOpenId(m.id);
    if (!m.read) mark.mutate({ id: m.id, read: 1 });
  }

  return (
    <div>
      <div className="adm-pagehead">
        <div>
          <h2>Messages</h2>
          <p>
            {list.length} message{list.length !== 1 ? 's' : ''} from the contact form
            {unread ? ` • ${unread} unread` : ''}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={() => mark.mutate({ mark_all_read: true })}>
            <CheckCheck size={15} /> Mark all read
          </Button>
        )}
      </div>

      <Card className="adm-table-card">
        {isLoading ? (
          <div className="adm-table-empty">Loading messages…</div>
        ) : list.length === 0 ? (
          <div className="adm-table-empty">
            No messages yet. Submissions from the contact page will appear here.
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th className="adm-th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="adm-cell-main">
                        {m.name} {!m.read ? <span style={{ color: '#f59e0b' }}>•</span> : null}
                      </div>
                      <div className="adm-cell-sub">{m.email}{m.phone ? ` • ${m.phone}` : ''}</div>
                    </td>
                    <td>{m.subject || <span className="adm-muted">—</span>}</td>
                    <td>
                      <div className="adm-cell-sub" style={{ maxWidth: 320 }}>
                        {String(m.body || '').slice(0, 90)}
                        {String(m.body || '').length > 90 ? '…' : ''}
                      </div>
                    </td>
                    <td>{fmt(m.created_at)}</td>
                    <td className="adm-td-right">
                      <div className="adm-row-actions">
                        <button type="button" className="adm-iconbtn" title="Read full message" onClick={() => open(m)}>
                          {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
                        </button>
                        <button type="button" className="adm-iconbtn adm-iconbtn--danger" title="Delete message" onClick={() => setDelId(m.id)}>
                          <Trash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!current} onClose={() => setOpenId(null)} title="Contact message">
        {current && (
          <div>
            <dl className="adm-report-grid" style={{ marginBottom: 18 }}>
              <div><span className="adm-report-k">Name</span><span className="adm-report-v">{current.name}</span></div>
              <div><span className="adm-report-k">Phone</span><span className="adm-report-v">{current.phone || '—'}</span></div>
              <div><span className="adm-report-k">Email</span><span className="adm-report-v">{current.email}</span></div>
              <div><span className="adm-report-k">Received</span><span className="adm-report-v">{fmt(current.created_at)}</span></div>
            </dl>
            {current.subject ? (
              <p style={{ margin: '0 0 12px', fontWeight: 700, color: '#0f172a' }}>{current.subject}</p>
            ) : null}
            <div className="adm-report-note" style={{ whiteSpace: 'pre-line' }}>{current.body}</div>
            <div className="adm-form-actions" style={{ marginTop: 20 }}>
              <Button variant="ghost" onClick={() => setOpenId(null)}>Close</Button>
              <Button
                onClick={() => { mark.mutate({ id: current.id, read: current.read ? 0 : 1 }); }}
                variant="outline"
              >
                Mark {current.read ? 'unread' : 'read'}
              </Button>
              <Button
                variant="danger"
                onClick={() => setDelId(current.id)}
              >
                <Trash size={15} /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={delId != null} onClose={() => setDelId(null)} title="Delete Message">
        <p className="adm-muted" style={{ margin: '0 0 20px' }}>
          Delete this message permanently? This cannot be undone.
        </p>
        <div className="adm-modal-foot" style={{ padding: 0 }}>
          <Button variant="ghost" onClick={() => setDelId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => remove.mutate(delId)} disabled={remove.isPending}>
            {remove.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}