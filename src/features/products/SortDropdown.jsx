import { useState } from 'react';

const SORTS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = SORTS.find(s => s.value === value) || SORTS[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          padding: '9px 14px', background: 'var(--bg-glass)',
          border: '1px solid var(--border-glass)', borderRadius: 10,
          color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'all var(--transition-fast)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-border)'}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = 'var(--border-glass)'; }}
      >
        Sort: {selected.label} <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 5 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '110%', right: 0,
            background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)',
            borderRadius: 10, padding: '6px 0', minWidth: '180px',
            boxShadow: 'var(--shadow-md)', zIndex: 10,
            animation: 'fadeSlideDown 0.2s ease',
          }}>
            {SORTS.map(s => (
              <button key={s.value} onClick={() => { onChange(s.value); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 16px', background: value === s.value ? 'rgba(232,165,176,0.1)' : 'none',
                  border: 'none', color: value === s.value ? 'var(--brand)' : 'var(--text-secondary)',
                  fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all var(--transition-fast)', fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass)'}
                onMouseLeave={e => e.currentTarget.style.background = value === s.value ? 'rgba(232,165,176,0.1)' : 'none'}
              >{s.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
