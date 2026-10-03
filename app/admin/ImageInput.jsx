'use client';

import { Input } from './ui';

export function ImageInput({ value, onChange }) {
  const src = String(value || '');
  return (
    <div>
      <Input
        type="text"
        value={src}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/assets/images/products/… or full URL"
      />
      {src && (
        <div className="adm-imgprev">
          <img
            src={src}
            alt="Preview"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <button type="button" onClick={() => onChange('')} className="adm-imgprev-x" aria-label="Remove image">
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
