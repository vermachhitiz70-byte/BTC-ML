'use client';

import { useState } from 'react';
import { Button, Input } from './ui';

export function ImageInput({ value, onChange, label }) {
  const [preview, setPreview] = useState(value);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (res.ok && json.url) {
        const url = json.url;
        onChange(url);
        setPreview(url);
      } else {
        alert(json.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      <Input type="text" value={value} onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }} placeholder="Image URL or upload" />
      <div className="mt-2 flex gap-2">
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50">
          <input type="file" accept="image/*" onChange={handleFile} className="sr-only" disabled={uploading} />
          {uploading ? 'Uploading…' : 'Upload Image'}
        </label>
        {(preview || value) && (
          <button
            type="button"
            onClick={() => { onChange(''); setPreview(''); }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        )}
      </div>
      {(preview || value) && (
        <div className="mt-3 relative inline-block">
          <img
            src={preview || value}
            alt="Preview"
            className="h-24 w-24 rounded-lg object-cover border border-slate-200"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}