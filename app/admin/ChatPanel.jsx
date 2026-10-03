'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Card, Input, Modal } from './ui';
import { Send, X, Trash, MessageSquare } from 'lucide-react';

function formatTime(v) {
  if (!v) return '';
  const d = new Date(String(v).replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

export function ChatPanel() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data: convos, refetch } = useQuery({
    queryKey: ['admin-chat'],
    queryFn: async () => {
      const res = await fetch('/api/admin/chat', { cache: 'no-store' });
      if (!res.ok) return { conversations: [] };
      return res.json();
    },
    refetchInterval: 5000,
  });

  async function openConvo(id) {
    if (open === id) { setOpen(null); return; }
    setOpen(id);
    try {
      const res = await fetch(`/api/admin/chat?convo_id=${id}`, { cache: 'no-store' });
      const j = await res.json();
      setMsgs(j.messages || []);
    } catch { /* ignore */ }
  }

  useEffect(() => {
    if (!open) return;
    const id = setInterval(async () => {
      try {
        const last = msgs.length ? msgs[msgs.length - 1].id : 0;
        const res = await fetch(`/api/admin/chat?convo_id=${open}&after=${last}`, { cache: 'no-store' });
        const j = await res.json();
        if (j.messages && j.messages.length) setMsgs((m) => [...m, ...j.messages]);
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(id);
  }, [open, msgs.length]);

  const send = useMutation({
    mutationFn: async (v) => {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ convo_id: open, text: v }),
      });
      if (!res.ok) throw new Error('Failed to send');
    },
    onSuccess: async () => {
      try {
        const last = msgs.length ? msgs[msgs.length - 1].id : 0;
        const res = await fetch(`/api/admin/chat?convo_id=${open}&after=${last}`, { cache: 'no-store' });
        const j = await res.json();
        if (j.messages && j.messages.length) setMsgs((m) => [...m, ...j.messages]);
      } catch { /* ignore */ }
      qc.invalidateQueries({ queryKey: ['admin-chat'] });
    },
    onError: (e) => toast.error(String(e.message || e)),
  });

  const remove = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/chat?convo_id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      toast.success('Conversation deleted');
      setDeleteId(null);
      if (open === deleteId) { setOpen(null); setMsgs([]); }
      refetch();
    },
    onError: (e) => toast.error(String(e.message || e)),
  });

  function handleSend(e) {
    e.preventDefault();
    const v = text.trim();
    if (!v || !open) return;
    setText('');
    send.mutate(v);
  }

  async function closeConvo() {
    await fetch('/api/admin/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ convo_id: open, text: 'Chat closed by support. Thank you!', close: true }),
    });
    setOpen(null);
    refetch();
  }

  const list = convos?.conversations || [];

  return (
    <div>
      <div className="adm-pagehead">
        <div>
          <h2>Live Chat</h2>
          <p>{list.length} conversation{list.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {list.map((c) => (
        <Card key={c.id} className="adm-convo">
          <div className="adm-convo-head">
            <div className="adm-convo-row">
              <button type="button" onClick={() => openConvo(c.id)} className="adm-convo-who"
                style={{ background: 'none', border: 0, padding: 0, textAlign: 'left' }} aria-label={`Open chat with ${c.visitor_name}`}>
                <div className="adm-avatar"><MessageSquare size={18} /></div>
                <div>
                  <div className="adm-convo-name">{c.visitor_name || 'Visitor'}</div>
                  <div className="adm-convo-sub">
                    {c.visitor_email} &bull; {c.status}
                    {c.unread ? <> &bull; <strong>{c.unread} NEW</strong></> : null}
                  </div>
                </div>
              </button>
              <div className="adm-convo-side">
                <div className="adm-convo-last">{(c.last_msg || 'No messages yet').slice(0, 80)}</div>
                <div className="adm-convo-time">{formatTime(c.updated_at)}</div>
                <div className="adm-convo-actions">
                  <button type="button" className="adm-iconbtn adm-iconbtn--danger" title="Delete conversation"
                    onClick={() => setDeleteId(c.id)}>
                    <Trash size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {open === c.id && (
            <div className="adm-thread">
              <div className="adm-msgs">
                {msgs.map((m) => (
                  <div key={m.id} className={m.sender === 'admin' ? 'adm-msgrow adm-msgrow--admin' : 'adm-msgrow adm-msgrow--visitor'}>
                    <div className={m.sender === 'admin' ? 'adm-msg adm-msg--admin' : 'adm-msg adm-msg--visitor'}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={(el) => { if (el) el.scrollIntoView({ behavior: 'smooth' }); }} />
              </div>

              <form onSubmit={handleSend} className="adm-composer">
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Reply as support…"
                  maxLength={1000}
                  aria-label="Reply message"
                />
                <Button type="submit" disabled={send.isPending} aria-label="Send reply">
                  <Send size={16} />
                </Button>
                <Button type="button" variant="ghost" onClick={closeConvo}>
                  <X size={16} /> Close
                </Button>
              </form>
            </div>
          )}
        </Card>
      ))}

      {list.length === 0 && (
        <Card className="adm-empty" style={{ padding: 56 }}>
          <MessageSquare size={44} style={{ color: '#cbd5e1', marginBottom: 12 }} />
          <h3 style={{ margin: '0 0 6px', fontSize: 17, color: '#334155' }}>No conversations yet</h3>
          <p className="adm-muted" style={{ margin: 0 }}>Chat conversations will appear here when visitors start chatting.</p>
        </Card>
      )}

      <Modal open={deleteId != null} onClose={() => setDeleteId(null)} title="Delete Conversation">
        <p className="adm-muted" style={{ margin: '0 0 20px' }}>
          Delete this conversation and all its messages? This cannot be undone.
        </p>
        <div className="adm-modal-foot" style={{ padding: 0 }}>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => remove.mutate(deleteId)} disabled={remove.isPending}>
            {remove.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
