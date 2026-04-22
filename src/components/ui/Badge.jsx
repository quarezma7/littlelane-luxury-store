const variants = {
  brand:     { background: 'rgba(232,165,176,0.15)', color: '#e8a5b0', border: '1px solid rgba(232,165,176,0.3)' },
  success:   { background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid rgba(39,174,96,0.3)' },
  danger:    { background: 'var(--danger-bg)',  color: 'var(--danger)',  border: '1px solid rgba(231,76,60,0.3)' },
  warning:   { background: 'var(--warning-bg)', color: 'var(--warning)', border: '1px solid rgba(243,156,18,0.3)' },
  info:      { background: 'var(--info-bg)',    color: 'var(--info)',    border: '1px solid rgba(52,152,219,0.3)' },
  muted:     { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' },
  admin:     { background: 'rgba(52,152,219,0.15)', color: '#3498db', border: '1px solid rgba(52,152,219,0.3)' },
  customer:  { background: 'rgba(232,165,176,0.1)', color: '#e8a5b0', border: '1px solid rgba(232,165,176,0.2)' },
};

export default function Badge({ children, variant = 'brand', pulse = false, style = {} }) {
  return (
    <span style={{
      ...variants[variant],
      padding: '3px 10px', borderRadius: 'var(--radius-full)',
      fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em',
      textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 5,
      animation: pulse ? 'pulse 2s ease-in-out infinite' : undefined,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  );
}
