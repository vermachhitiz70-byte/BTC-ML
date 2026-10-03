'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
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
    onError: (e) => toast.error(String(e.message || e)),
  });

  function submit(e) {
    e.preventDefault();
    save.mutate(f);
  }

  return (
    <div className="adm-narrow">
      <h2 className="adm-sec-title">Settings</h2>

      <div className="adm-stack">
        <Card className="adm-panel">
          <h3>Payment Settings</h3>
          <p className="adm-panel-sub">Shown to customers on checkout</p>
          <form onSubmit={submit} className="adm-form">
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
            <div>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? 'Saving…' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="adm-panel">
          <h3>Change Admin Password</h3>
          <p className="adm-panel-sub">Minimum 8 characters</p>
          <ChangePasswordForm />
        </Card>
      </div>
    </div>
  );
}

function PwField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <div className="adm-pw-wrap">
        <Input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button type="button" onClick={() => setShow(!show)} className="adm-eye"
          aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
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
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || 'Failed to change password');
    },
    onSuccess: () => {
      toast.success('Password changed');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    },
    onError: (e) => toast.error(String(e.message || e)),
  });

  function submit(e) {
    e.preventDefault();
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    save.mutate({ currentPassword: currentPw, newPassword: newPw });
  }

  return (
    <form onSubmit={submit} className="adm-form">
      <PwField label="Current Password" value={currentPw} onChange={setCurrentPw} placeholder="Current password" />
      <PwField label="New Password" value={newPw} onChange={setNewPw} placeholder="New password (min 8 chars)" />
      <PwField label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} placeholder="Confirm new password" />
      <div>
        <Button type="submit" disabled={save.isPending || !currentPw || !newPw || !confirmPw}>
          {save.isPending ? 'Changing…' : 'Change Password'}
        </Button>
      </div>
    </form>
  );
}
