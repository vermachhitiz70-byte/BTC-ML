'use client';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}) {
  const styles = {
    primary: 'bg-navy-600 hover:bg-navy-700 text-white shadow-[0_5px_0_0_#1e3a8a]',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-white shadow-[0_5px_0_0_#1f2937]',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 shadow-none active:translate-y-0',
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-[0_5px_0_0_#cbd5e1]',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-[0_5px_0_0_#b91c1c]',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_5px_0_0_#047857]',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-100 active:translate-y-[3px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0',
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100',
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, children, ...props }) {
  return (
    <label className={cn('block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5', className)} {...props}>
      {children}
    </label>
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-700',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-10">
      <div className={`w-full rounded-2xl bg-white shadow-xl ${wide ? 'max-w-5xl' : 'max-w-2xl'}`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}