const variants = {
  primary: {
    background: 'var(--brand-gradient)', color: '#0a0c18',
    border: 'none', fontWeight: 600,
  },
  secondary: {
    background: 'var(--bg-glass)', color: 'var(--text-primary)',
    border: '1px solid var(--border-glass)', fontWeight: 500,
  },
  ghost: {
    background: 'transparent', color: 'var(--text-secondary)',
    border: '1px solid var(--border-subtle)', fontWeight: 400,
  },
  danger: {
    background: 'var(--danger-bg)', color: 'var(--danger)',
    border: '1px solid var(--danger)', fontWeight: 500,
  },
  success: {
    background: 'var(--success-bg)', color: 'var(--success)',
    border: '1px solid var(--success)', fontWeight: 500,
  },
};
const sizes = {
  sm: { padding: '6px 14px', fontSize: '0.8rem', borderRadius: 8 },
  md: { padding: '10px 20px', fontSize: '0.875rem', borderRadius: 10 },
  lg: { padding: '13px 28px', fontSize: '1rem', borderRadius: 12 },
};

export default function Button({
  children, variant = 'primary', size = 'md',
  onClick, disabled, fullWidth, style = {}, id,
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        fontFamily: 'var(--font-body)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--transition-fast)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = 'var(--shadow-brand)'; }}}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.02)'; }}
    >
      {children}
    </button>
  );
}
