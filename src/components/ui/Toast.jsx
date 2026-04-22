import { useEffect, useState } from 'react';

function Toast({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), 3500);
    const t2 = setTimeout(() => onRemove(toast.id), 4000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [toast.id, onRemove]);

  const colors = {
    success: { border: 'var(--success)', icon: '✓', bg: 'var(--success-bg)' },
    error:   { border: 'var(--danger)',  icon: '✕', bg: 'var(--danger-bg)' },
    warning: { border: 'var(--warning)', icon: '⚠', bg: 'var(--warning-bg)' },
    info:    { border: 'var(--info)',    icon: 'ℹ', bg: 'var(--info-bg)' },
  };
  const c = colors[toast.type] || colors.success;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--bg-secondary)',
      border: `1px solid ${c.border}`,
      borderLeft: `4px solid ${c.border}`,
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      boxShadow: 'var(--shadow-md)',
      minWidth: 280, maxWidth: 380,
      animation: exiting ? 'toastOut 0.4s ease forwards' : 'toastIn 0.4s ease',
      transition: 'opacity 0.3s',
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: 'var(--radius-full)',
        background: c.bg, color: c.border,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
      }}>{c.icon}</span>
      <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem', flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', fontSize: '0.8rem', padding: '2px',
          transition: 'color var(--transition-fast)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >✕</button>
    </div>
  );
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24,
      display: 'flex', flexDirection: 'column', gap: 10,
      zIndex: 'var(--z-toast)', pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'all' }}>
          <Toast toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
