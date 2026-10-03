'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Input, Label, Card } from './ui';

export function SettingsPanel() {
  const qc = useQueryClient();
  const [f, setF] = useState({ pay_coin: '', pay_address: '', pay_qr: '', support_note: '' });

  const { data } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      if (!res.ok) return {};
      return res.json();
    },
  });

  useEffect(() => {
    if (data?.settings) setF(data.settings);
  }, [data]);

  const save = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
    },
    onSuccess: () => {
      toast.success('Settings saved');
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: (e) => toast.error(String(e)),
  });

  function submit(e) {
    e.preventDefault();
    save.mutate(f);
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings</h2>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Settings</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Coin Label</Label>
            <Input value={f.pay_coin} onChange={(e) => setF({ ...f, pay_coin: e.target.value })} placeholder="e.g. USDT (BEP20)" />
          </div>
          <div>
            <Label>Wallet Address</Label>
            <Input value={f.pay_address} onChange={(e) => setF({ ...f, pay_address: e.target.value })} placeholder="0x..." />
          </div>
          <div>
            <Label>QR Code Image URL</Label>
            <Input value={f.pay_qr} onChange={(e) => setF({ ...f, pay_qr: e.target.value })} placeholder="/assets/images/qr.png or full URL" />
          </div>
          <div>
            <Label>Support Note (shown on checkout)</Label>
            <Input value={f.support_note} onChange={(e) => setF({ ...f, support_note: e.target.value })} placeholder="Contact support if you need help..." />
          </div>
          <Button type="submit" disabled={save.isPending} className="shadow-lg shadow-navy-500/25">
            {save.isPending ? 'Saving…' : 'Save Settings'}
          </Button>
        </form>
      </Card>

      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Admin Password</h3>
        <ChangePasswordForm />
      </Card>
    </div>
  );
}

function ChangePasswordForm() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const save = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to change password');
      }
    },
    onSuccess: () => {
      toast.success('Password changed');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    },
    onError: (e) => toast.error(String(e)),
  });

  function submit(e) {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    save.mutate({ currentPassword: currentPw, newPassword: newPw });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label>Current Password</Label>
        <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Current password" />
      </div>
      <div>
        <Label>New Password</Label>
        <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password (min 8 chars)" />
      </div>
      <div>
        <Label>Confirm New Password</Label>
        <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirm new password" />
      </div>
      <Button type="submit" disabled={save.isPending || !currentPw || !newPw || !confirmPw}>
        {save.isPending ? 'Changing…' : 'Change Password'}
      </Button>
    </form>
  );
}