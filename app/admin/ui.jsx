'use client';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const VARIANTS = {
  primary: 'adm-btn--primary',
  gold: 'adm-btn--gold',
  success: 'adm-btn--success',
  danger: 'adm-btn--danger',
  ghost: 'adm-btn--ghost',
  outline: 'adm-btn--outline',
};

export function Button({ variant = 'primary', size, block, className, children, ...props }) {
  return (
    <button
      className={cn(
        'adm-btn',
        VARIANTS[variant] || VARIANTS.primary,
        size === 'sm' && 'adm-btn--sm',
        block && 'adm-btn--block',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...props }) {
  return <input className={cn('adm-input', className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn('adm-textarea', className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn('adm-select', className)} {...props}>
      {children}
    </select>
  );
}

export function Label({ className, children, ...props }) {
  return (
    <label className={cn('adm-label', className)} {...props}>
      {children}
    </label>
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('adm-card', className)} {...props}>
      {children}
    </div>
  );
}

const CHIP_COLORS = {
  green: 'adm-chip--green',
  amber: 'adm-chip--amber',
  slate: 'adm-chip--slate',
  red: 'adm-chip--red',
  blue: 'adm-chip--blue',
  purple: 'adm-chip--purple',
};

export function Chip({ color = 'slate', className, children, ...props }) {
  return (
    <span className={cn('adm-chip', CHIP_COLORS[color] || CHIP_COLORS.slate, className)} {...props}>
      {children}
    </span>
  );
}

// Backwards-compatible alias (was dynamic Tailwind classes before — now static).
export function Badge({ className, children, ...props }) {
  return (
    <span className={cn('adm-chip adm-chip--slate', className)} {...props}>
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, children, wide, footer }) {
  if (!open) return null;
  return (
    <div className="adm-modal-ov" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={cn('adm-modal', wide && 'adm-modal--wide')} role="dialog" aria-modal="true" aria-label={title}>
        <div className="adm-modal-head">
          <h3 className="adm-modal-title">{title}</h3>
          <button type="button" onClick={onClose} className="adm-modal-x" aria-label="Close">
            &times;
          </button>
        </div>
        <div className="adm-modal-body">{children}</div>
        {footer ? <div className="adm-modal-foot">{footer}</div> : null}
      </div>
    </div>
  );
}
