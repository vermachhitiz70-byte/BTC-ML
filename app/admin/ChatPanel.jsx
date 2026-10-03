'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Card } from './ui';
import { Send, X, MessageSquare } from 'lucide-react';

export function ChatPanel() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');

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
    setOpen(id);
    const res = await fetch(`/api/admin/chat?convo_id=${id}`, { cache: 'no-store' });
    const j = await res.json();
    setMsgs(j.messages || []);
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
      const res = await fetch(`/api/admin/chat?convo_id=${open}&after=${msgs.length ? msgs[msgs.length - 1].id : 0}`, { cache: 'no-store' });
      const j = await res.json();
      if (j.messages && j.messages.length) setMsgs((m) => [...m, ...j.messages]);
      qc.invalidateQueries({ queryKey: ['admin-chat'] });
    },
    onError: (e) => toast.error(String(e)),
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Live Chat Conversations</h2>
        <span className="text-sm text-slate-500">{(convos?.conversations || []).length} active</span>
      </div>

      {(convos?.conversations || []).map((c) => (
        <Card key={c.id} className="mb-4 overflow-hidden shadow-lg shadow-slate-200/50">
          <div className="p-4 bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{c.visitor_name}</div>
                  <div className="text-sm text-slate-500">{c.visitor_email} • {c.status}{c.unread ? ` • ${c.unread} NEW` : ''}</div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 truncate max-w-xs">{(c.last_msg || 'No messages yet').slice(0, 80)}</p>
                <p className="text-xs text-slate-400">{new Date(c.updated_at).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {open === c.id && (
            <div className="border-t border-slate-100 bg-white">
              <div className="h-80 overflow-y-auto p-4 space-y-3">
                {msgs.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                      m.sender === 'admin'
                        ? 'bg-navy-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={(el) => { if (el) el.scrollIntoView({ behavior: 'smooth' }); }} />
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Reply as support…"
                  maxLength={1000}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                />
                <Button type="submit" disabled={send.isPending} className="shadow-lg shadow-navy-500/25">
                  <Send size={16} />
                </Button>
                <Button type="button" variant="ghost" onClick={closeConvo} className="text-red-600 hover:bg-red-50">
                  <X size={16} className="mr-1" /> Close
                </Button>
              </form>
            </div>
          )}
        </Card>
      ))}

      {(convos?.conversations || []).length === 0 && (
        <Card className="p-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No conversations yet</h3>
          <p className="text-slate-500">Chat conversations will appear here when visitors start chatting.</p>
        </Card>
      )}
    </div>
  );
}